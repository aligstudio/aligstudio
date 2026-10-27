import type { CSSProperties } from 'react';
import type { SiteContent } from '@/lib/types';
import { extractYouTubeId } from '@/lib/utils';
import { Icon } from '../icons';
import { SmartLink } from '../SmartLink';

export function Youtube({ youtube }: { youtube: SiteContent['youtube'] }) {
  return (
    <section className="section youtube">
      <div className="container">
        <div className="youtube__panel">
          <div className="youtube__head">
            <div>
              <p className="eyebrow" data-reveal>
                <i aria-hidden="true" /> {youtube.eyebrow}
              </p>
              <h2 className="youtube__title" data-reveal>
                {youtube.title}
              </h2>
            </div>
            <div className="youtube__intro" data-reveal>
              <p>{youtube.description}</p>
              <div className="youtube__meta">
                <span>
                  <Icon name="youtube" size={16} /> {youtube.handle}
                </span>
              </div>
            </div>
          </div>

          <div className="youtube__grid">
            {youtube.videos.map((video, index) => {
              const videoId = extractYouTubeId(video.youtubeId);
              const href = videoId
                ? `https://www.youtube.com/watch?v=${videoId}`
                : youtube.channelUrl;
              return (
                <SmartLink
                  key={`${video.title}-${index}`}
                  href={href}
                  className="video-card"
                  ariaLabel={video.title}
                >
                  <span
                    className="video-card__frame"
                    data-reveal
                    style={{ '--d': `${index * 70}ms` } as CSSProperties}
                  >
                    {videoId ? (
                      <img
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                      />
                    ) : (
                      <span className={`video-art video-art--${index % 3}`}>
                        <span className="video-art__grid" aria-hidden="true" />
                        <span className="video-art__glyph" aria-hidden="true">
                          <Icon name="spark" size={48} strokeWidth={1.2} />
                        </span>
                        <span className="video-art__label">{youtube.handle}</span>
                      </span>
                    )}
                    <span className="video-card__play">
                      <Icon name="play" size={18} />
                    </span>
                    <span className="video-card__time">{video.duration || 'Yakında'}</span>
                  </span>
                  <span className="video-card__body">
                    <span className="video-card__index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="video-card__title">{video.title}</span>
                    <Icon name="arrowUpRight" size={16} />
                  </span>
                </SmartLink>
              );
            })}
          </div>

          <div className="youtube__foot" data-reveal>
            <span className="youtube__foot-note">
              <span className="status-dot" aria-hidden="true" /> {youtube.subscribers}
            </span>
            <SmartLink href={youtube.channelUrl} className="btn btn--accent">
              {youtube.ctaLabel || 'Kanala git'} <Icon name="youtube" size={17} />
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
