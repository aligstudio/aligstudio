'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons';
import type { AdminField as AdminFieldConfig } from '@/lib/admin-schema';

type FieldProps = {
  field: AdminFieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  prefix?: string;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item ?? '')) : [];
}

function asObjectArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null && !Array.isArray(item)
      )
    : [];
}

function asObject(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function blankItem(fields: AdminFieldConfig[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  fields.forEach((field) => {
    if (field.kind === 'strings' || field.kind === 'list') item[field.key] = [];
    else if (field.kind === 'object') item[field.key] = {};
    else if (field.kind === 'color') item[field.key] = '#C6F24E';
    else if (field.kind === 'toggle') item[field.key] = true;
    else item[field.key] = '';
  });
  return item;
}

function optionLabel(field: AdminFieldConfig, value: unknown, fallback: string): string {
  const sub = field.fields?.find((item) => item.key === field.itemLabel);
  if (sub?.options) {
    const match = sub.options.find((option) => option.value === value);
    if (match) return match.label;
  }
  return String(value ?? '') || fallback;
}

function ImageField({ field, value, onChange }: FieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const src = asString(value);

  async function upload(file: File) {
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        message?: string;
      };
      if (!response.ok || !result.ok || !result.url) {
        throw new Error(result.message || 'Görsel yüklenemedi.');
      }
      onChange(result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Görsel yüklenemedi.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="af-image">
      <div className="af-image__preview">
        {src ? (
          <img src={src} alt="" />
        ) : (
          <span>
            <Icon name="image" size={22} />
            Görsel yok
          </span>
        )}
      </div>
      <div className="af-image__controls">
        <input
          type="text"
          value={src}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://... veya dosya yükle"
          aria-label={`${field.label} bağlantısı`}
        />
        <div className="af-image__buttons">
          <label className={`af-upload ${uploading ? 'is-busy' : ''}`}>
            <Icon name="upload" size={14} />
            {uploading ? 'Yükleniyor...' : 'Görsel yükle'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
                event.target.value = '';
              }}
            />
          </label>
          {src ? (
            <button type="button" className="af-clear" onClick={() => onChange('')}>
              Kaldır
            </button>
          ) : null}
        </div>
        {error ? <p className="af-error">{error}</p> : null}
      </div>
    </div>
  );
}

function StringsField({ field, value, onChange }: FieldProps) {
  const items = asStringArray(value);
  return (
    <div className="af-strings">
      {items.map((item, index) => (
        <div className="af-strings__row" key={index}>
          <input
            type="text"
            value={item}
            aria-label={`${field.label} ${index + 1}`}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            aria-label={`${field.label} ${index + 1} kaldır`}
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="af-add"
        onClick={() => onChange([...items, ''])}
      >
        <Icon name="plus" size={14} />
        {field.addLabel || 'Ekle'}
      </button>
    </div>
  );
}

function ListField({ field, value, onChange }: FieldProps) {
  const items = asObjectArray(value);
  const [openIndex, setOpenIndex] = useState<number | null>(items.length === 1 ? 0 : null);

  function updateItem(index: number, patch: Record<string, unknown>) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setOpenIndex((prev) => (prev === index ? target : prev === target ? index : prev));
  }

  function remove(index: number, label: string) {
    if (!window.confirm(`"${label || `Öğe ${index + 1}`}" silinsin mi?`)) return;
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
    setOpenIndex(null);
  }

  return (
    <div className="af-list">
      {items.length === 0 ? (
        <p className="af-list__empty">Henüz öğe yok. Aşağıdan ilkini ekleyebilirsin.</p>
      ) : null}

      {items.map((item, index) => {
        const rawLabel = item[field.itemLabel || ''] ?? item.title ?? item.label ?? '';
        const label = optionLabel(field, rawLabel, `Öğe ${index + 1}`);
        const isOpen = openIndex === index;

        return (
          <div className={`af-item ${isOpen ? 'is-open' : ''}`} key={index}>
            <div className="af-item__head">
              <button
                type="button"
                className="af-item__toggle"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="af-item__num">{String(index + 1).padStart(2, '0')}</span>
                <span className="af-item__name">{label}</span>
                <Icon name="chevronDown" size={15} />
              </button>
              <div className="af-item__actions">
                <button
                  type="button"
                  aria-label="Yukarı taşı"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <Icon name="arrowUp" size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Aşağı taşı"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <Icon name="arrowDown" size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Sil"
                  className="is-danger"
                  onClick={() => remove(index, label)}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>

            {isOpen ? (
              <div className="af-item__body">
                {(field.fields || []).map((sub) => (
                  <FieldRenderer
                    key={sub.key}
                    field={sub}
                    value={item[sub.key]}
                    onChange={(nextValue) => updateItem(index, { [sub.key]: nextValue })}
                    prefix={`${field.key}-${index}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        className="af-add af-add--block"
        onClick={() => {
          const nextItem = field.newItem
            ? (JSON.parse(JSON.stringify(field.newItem)) as Record<string, unknown>)
            : blankItem(field.fields || []);
          onChange([...items, nextItem]);
          setOpenIndex(items.length);
        }}
      >
        <Icon name="plus" size={15} />
        {field.addLabel || 'Yeni öğe ekle'}
      </button>
    </div>
  );
}

function FieldRenderer({ field, value, onChange, prefix = '' }: FieldProps) {
  const inputId = `field-${prefix ? `${prefix}-` : ''}${field.key}`.replace(/\./g, '-');
  const wrapperClass = `af-field${field.width === 'half' ? ' af-field--half' : ''}`;
  const hint = field.hint ? <small className="af-hint">{field.hint}</small> : null;
  const label = (
    <div className="af-label">
      <label htmlFor={inputId}>{field.label}</label>
      {hint}
    </div>
  );

  if (field.kind === 'toggle') {
    const checked = Boolean(value);
    return (
      <div className={wrapperClass}>
        <button
          id={inputId}
          type="button"
          role="switch"
          aria-checked={checked}
          className={`af-toggle ${checked ? 'is-on' : ''}`}
          onClick={() => onChange(!checked)}
        >
          <span className="af-toggle__copy">
            <strong>{field.label}</strong>
            {field.hint ? <small>{field.hint}</small> : null}
          </span>
          <span className="af-toggle__pill">
            <span className="af-toggle__state">{checked ? 'Açık' : 'Gizli'}</span>
            <span className="af-toggle__track">
              <span className="af-toggle__thumb" />
            </span>
          </span>
        </button>
      </div>
    );
  }

  if (field.kind === 'image') {
    return (
      <div className={wrapperClass}>
        {label}
        <ImageField field={field} value={value} onChange={onChange} prefix={prefix} />
      </div>
    );
  }

  if (field.kind === 'strings') {
    return (
      <div className={wrapperClass}>
        {label}
        <StringsField field={field} value={value} onChange={onChange} prefix={prefix} />
      </div>
    );
  }

  if (field.kind === 'list') {
    return (
      <div className={`${wrapperClass} af-field--list`}>
        {label}
        <ListField field={field} value={value} onChange={onChange} prefix={prefix} />
      </div>
    );
  }

  if (field.kind === 'object') {
    const objectValue = asObject(value);
    return (
      <div className={wrapperClass}>
        {label}
        <div className="af-object">
          {(field.fields || []).map((sub) => (
            <FieldRenderer
              key={sub.key}
              field={sub}
              value={objectValue[sub.key]}
              onChange={(nextValue) => onChange({ ...objectValue, [sub.key]: nextValue })}
              prefix={`${prefix}${field.key}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.kind === 'select') {
    return (
      <div className={wrapperClass}>
        {label}
        <select
          id={inputId}
          value={asString(value)}
          onChange={(event) => onChange(event.target.value)}
        >
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.kind === 'color') {
    const color = /^#[0-9a-fA-F]{6}$/.test(asString(value)) ? asString(value) : '#c6f24e';
    return (
      <div className={wrapperClass}>
        {label}
        <div className="af-color">
          <input
            type="color"
            value={color}
            aria-label={`${field.label} seç`}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
          />
          <input
            id={inputId}
            type="text"
            value={asString(value)}
            onChange={(event) => onChange(event.target.value)}
            placeholder="#C6F24E"
          />
        </div>
      </div>
    );
  }

  if (field.kind === 'textarea') {
    return (
      <div className={wrapperClass}>
        {label}
        <textarea
          id={inputId}
          rows={field.rows || 3}
          value={asString(value)}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {label}
      <input
        id={inputId}
        type="text"
        value={asString(value)}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export { FieldRenderer };
