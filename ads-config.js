/**
 * ==============================================================================
 * CinePulse - HilltopAds Monetization Configuration & Integration Script
 * ==============================================================================
 * 
 * Niche: CinePulse - Movie Reviews, Trailers & Streaming Guide
 * 
 * This file centralizes and manages all 6 HilltopAds monetization ad zones:
 *  - Zone 1: Popunder / OnClick Tag
 *  - Zone 2: In-Page Push (IPP) MultiTag
 *  - Zone 3: MultiTag Banners (728x90 Top Leaderboard & 300x250 Review Sidebar)
 *  - Zone 4: Video Slider MultiTag
 *  - Zone 5: Direct Link / SmartLink (Attached to 'Watch Trailer in 4K', 'Check Cinema Showtimes', 'Stream Now' CTAs)
 *  - Zone 6: Video VAST (Integrated into HTML5 Trailer Player with Pre-Roll & Mid-Roll support)
 * 
 * INSTRUCTIONS FOR PUBLISHER / USER:
 * 1. Log in to your HilltopAds Publisher account (https://hilltopads.com).
 * 2. Add your website domain (e.g. cinepulse.com) in your HilltopAds Dashboard.
 * 3. Create and generate ad codes for each zone format.
 * 4. Replace the placeholder Zone IDs, script URLs, and SmartLink URLs below.
 * 5. Set `isDemoMode: false` when ready to serve live production ads.
 * ==============================================================================
 */

const CINEPULSE_ADS_CONFIG = {
  // Global switch: When true, displays interactive visual previews and notifications.
  // Set to false in production once real HilltopAds Zone IDs are added.
  isDemoMode: true,

  // ----------------------------------------------------------------------------
  // ZONE 1: Popunder / OnClick
  // Opens a monetized tab/window behind the browser on first user click.
  // ----------------------------------------------------------------------------
  zone1_popunder: {
    enabled: true,
    zoneId: "YOUR_POPUNDER_ZONE_ID", // e.g. "891234"
    scriptUrl: "https://example-hilltopads-cdn.com/popunder.js", // Replace with your HilltopAds Popunder script URL
    triggerOncePerSession: true,
    storageKey: "cinepulse_popunder_shown",
    delaySeconds: 0
  },

  // ----------------------------------------------------------------------------
  // ZONE 2: In-Page Push (IPP) MultiTag
  // Native non-intrusive push alerts formatted for moviegoers and entertainment buffs
  // ----------------------------------------------------------------------------
  zone2_inPagePush: {
    enabled: true,
    zoneId: "YOUR_IPP_ZONE_ID", // e.g. "891235"
    scriptUrl: "https://example-hilltopads-cdn.com/ipp-multitag.js",
    position: "bottom-right",
    displayDelayMs: 3200,
    demoTitle: "🎟 Flash Deal: 2-for-1 IMAX 70mm Passes",
    demoMessage: "Limited weekend cinema pass for Dune: Part Two & Gladiator II screenings in Dolby Atmos.",
    demoIcon: "🍿",
    demoTime: "Just now",
    demoCtaText: "Claim Tickets →"
  },

  // ----------------------------------------------------------------------------
  // ZONE 3: MultiTag Banners
  // Auto-optimizing high-CPM responsive banners (Leaderboard 728x90 & Sidebar 300x250)
  // ----------------------------------------------------------------------------
  zone3_banners: {
    leaderboard_728x90: {
      enabled: true,
      zoneId: "YOUR_LEADERBOARD_BANNER_ZONE_ID", // e.g. "891236"
      containerId: "ad-zone-header-728x90",
      scriptUrl: "https://example-hilltopads-cdn.com/banner-728x90.js",
      dimensions: { width: 728, height: 90 },
      label: "Top Leaderboard MultiTag"
    },
    sidebar_300x250: {
      enabled: true,
      zoneId: "YOUR_SIDEBAR_BANNER_ZONE_ID", // e.g. "891237"
      containerId: "ad-zone-sidebar-300x250",
      scriptUrl: "https://example-hilltopads-cdn.com/banner-300x250.js",
      dimensions: { width: 300, height: 250 },
      label: "Critic Review Sidebar MultiTag"
    }
  },

  // ----------------------------------------------------------------------------
  // ZONE 4: Video Slider MultiTag
  // High-impact floating outstream video slider docked in the corner of the viewport
  // ----------------------------------------------------------------------------
  zone4_videoSlider: {
    enabled: true,
    zoneId: "YOUR_VIDEO_SLIDER_ZONE_ID", // e.g. "891238"
    containerId: "ad-zone-video-slider",
    scriptUrl: "https://example-hilltopads-cdn.com/video-slider.js",
    position: "bottom-right",
    autoSlideDelayMs: 2500,
    demoTitle: "Premiere Sponsor: Stream 4K Cinema Anywhere",
    demoTag: "CINEPULSE OUTSTREAM VIDEO SPONSOR"
  },

  // ----------------------------------------------------------------------------
  // ZONE 5: Direct Link / SmartLink
  // Geo-targeted, device-optimized monetized URL attached to high-CTR cinema buttons
  // ----------------------------------------------------------------------------
  zone5_directLink: {
    enabled: true,
    smartLinkUrl: "https://hilltopads.com/smartlink?zone=YOUR_SMARTLINK_ZONE_ID", // Replace with your SmartLink URL
    // CSS selectors for movie-specific CTAs that route through this Direct Link:
    selectors: [
      ".btn-watch-trailer-4k",
      ".btn-check-showtimes",
      ".btn-stream-4k",
      ".btn-book-imax",
      ".direct-link-trigger",
      "[data-ad-action='direct-link']"
    ],
    openInNewTab: true
  },

  // ----------------------------------------------------------------------------
  // ZONE 6: Video VAST (Linear Video Ad for HTML5 Trailer Player)
  // Industry-standard VAST XML ad tags serving pre-roll & mid-roll commercials
  // ----------------------------------------------------------------------------
  zone6_videoVAST: {
    enabled: true,
    vastTagUrl: "https://example-hilltopads-vast.com/vast.xml?zone=YOUR_VAST_ZONE_ID", // Replace with HilltopAds VAST XML Tag
    videoPlayerId: "cinepulse-trailer-player",
    adOverlayId: "vast-ad-overlay",
    skipTimeSeconds: 5,
    adDurationSeconds: 15,
    sponsorName: "MaxStream 4K Ultra Theater Pass",
    sponsorBadge: "ADVERTISEMENT • VAST 4.0 TAG"
  }
};

/**
 * ==============================================================================
 * HilltopAds Cinema Monetization Manager
 * Handles script injection, demo mockups, player hooks, and user events
 * ==============================================================================
 */
class HilltopAdsCinemaManager {
  constructor(config) {
    this.config = config;
    this.isVastPlaying = false;
    this.vastCompleted = false;
  }

  init() {
    console.log("%c[CinePulse | HilltopAds] Monetization Engine Initialized", "color: #e50914; font-weight: bold; font-size: 13px;");
    
    this.initZone1Popunder();
    this.initZone2InPagePush();
    this.initZone3Banners();
    this.initZone4VideoSlider();
    this.initZone5DirectLinks();
    this.initZone6VideoVAST();
    this.setupConfigModal();
  }

  /**
   * ============================================================================
   * ZONE 1: Popunder / OnClick Implementation
   * ============================================================================
   */
  initZone1Popunder() {
    const cfg = this.config.zone1_popunder;
    if (!cfg || !cfg.enabled) return;

    if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_POPUNDER_ZONE_ID") {
      // PRODUCTION MODE: Dynamically inject HilltopAds Popunder Script
      console.log(`[HilltopAds] Injected Zone 1 Popunder Tag (${cfg.zoneId})`);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
      script.async = true;
      document.head.appendChild(script);
    } else {
      // DEMO / SIMULATION MODE
      const handlePopunderClick = (e) => {
        // Ignore interactions on controls, links or modal components
        if (e.target.closest("button, a, input, select, textarea, .config-modal, .vast-controls, .video-slider-box")) {
          return;
        }

        if (cfg.triggerOncePerSession && sessionStorage.getItem(cfg.storageKey)) {
          return;
        }

        sessionStorage.setItem(cfg.storageKey, "true");
        this.showToastNotification(
          "Zone 1: Popunder / OnClick Activated",
          `In live production with Zone ID <code>${cfg.zoneId}</code>, an advertiser tab launches behind the browser upon the first cinema portal interaction.`,
          "popunder"
        );
        document.removeEventListener("click", handlePopunderClick);
      };

      document.addEventListener("click", handlePopunderClick);
    }
  }

  /**
   * ============================================================================
   * ZONE 2: In-Page Push (IPP) MultiTag Implementation
   * ============================================================================
   */
  initZone2InPagePush() {
    const cfg = this.config.zone2_inPagePush;
    if (!cfg || !cfg.enabled) return;

    if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_IPP_ZONE_ID") {
      // PRODUCTION MODE: Load HilltopAds IPP MultiTag script
      console.log(`[HilltopAds] Injected Zone 2 IPP MultiTag (${cfg.zoneId})`);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
      script.async = true;
      document.body.appendChild(script);
    } else {
      // DEMO MODE: Create cinematic floating notification
      setTimeout(() => {
        const container = document.getElementById("ad-zone-inpage-push");
        if (!container) return;

        container.innerHTML = `
          <div class="ipp-card cine-fade-in" id="ipp-demo-card">
            <div class="ipp-header">
              <span class="ipp-badge"><span class="pulse-red-dot"></span> Zone 2: In-Page Push MultiTag</span>
              <button class="ipp-close-btn" id="ipp-close-btn" title="Dismiss" aria-label="Close notification">&times;</button>
            </div>
            <div class="ipp-body">
              <div class="ipp-poster-thumb">
                <span class="ipp-film-icon">${cfg.demoIcon}</span>
              </div>
              <div class="ipp-content">
                <div class="ipp-title-row">
                  <h4 class="ipp-title">${cfg.demoTitle}</h4>
                </div>
                <p class="ipp-desc">${cfg.demoMessage}</p>
                <div class="ipp-action-row">
                  <span class="ipp-time">${cfg.demoTime}</span>
                  <a href="${this.config.zone5_directLink.smartLinkUrl}" target="_blank" rel="noopener" class="ipp-cta-btn direct-link-trigger">${cfg.demoCtaText}</a>
                </div>
              </div>
            </div>
            <div class="ipp-footer-meta">
              <span>HilltopAds MultiTag Placement &bull; Zone: <code>${cfg.zoneId}</code></span>
            </div>
          </div>
        `;

        container.classList.add("ipp-active");

        const closeBtn = document.getElementById("ipp-close-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            container.classList.remove("ipp-active");
            setTimeout(() => {
              container.innerHTML = "";
            }, 300);
          });
        }
      }, cfg.displayDelayMs || 3000);
    }
  }

  /**
   * ============================================================================
   * ZONE 3: MultiTag Banners (728x90 Header & 300x250 Review Sidebar)
   * ============================================================================
   */
  initZone3Banners() {
    const banners = this.config.zone3_banners;
    if (!banners) return;

    // Leaderboard 728x90
    if (banners.leaderboard_728x90 && banners.leaderboard_728x90.enabled) {
      const cfg = banners.leaderboard_728x90;
      const el = document.getElementById(cfg.containerId);
      if (el) {
        if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_LEADERBOARD_BANNER_ZONE_ID") {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
          script.async = true;
          el.innerHTML = "";
          el.appendChild(script);
        } else {
          this.renderBannerSlot(
            el,
            "Zone 3: MultiTag Leaderboard Banner",
            "728x90",
            cfg.zoneId,
            "Premium Above-the-Fold Movie Premieres & Cinema Ticketing Ad Slot"
          );
        }
      }
    }

    // Sidebar 300x250
    if (banners.sidebar_300x250 && banners.sidebar_300x250.enabled) {
      const cfg = banners.sidebar_300x250;
      const el = document.getElementById(cfg.containerId);
      if (el) {
        if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_SIDEBAR_BANNER_ZONE_ID") {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
          script.async = true;
          el.innerHTML = "";
          el.appendChild(script);
        } else {
          this.renderBannerSlot(
            el,
            "Zone 3: MultiTag Medium Rectangle",
            "300x250",
            cfg.zoneId,
            "Critic Reviews Sidebar Sticky Placement (High Time-on-Page)"
          );
        }
      }
    }
  }

  renderBannerSlot(container, title, size, zoneId, subtitle) {
    const isLeaderboard = size === "728x90";
    container.innerHTML = `
      <div class="ad-banner-frame frame-${size.replace("x", "-")}">
        <div class="ad-frame-top">
          <span class="ad-gold-badge">ADVERTISEMENT</span>
          <span class="ad-zone-label">${title} [${size}]</span>
          <span class="ad-zone-code">Zone ID: <code>${zoneId}</code></span>
        </div>
        <div class="ad-frame-body">
          <div class="ad-cine-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </div>
          <div class="ad-frame-content">
            <strong class="ad-head">HilltopAds MultiTag Auto-Optimized Banner</strong>
            <p class="ad-sub">${subtitle}</p>
            <span class="ad-tip">Insert HilltopAds snippet or change Zone ID in <code>ads-config.js</code></span>
          </div>
          <div class="ad-frame-action">
            <button class="ad-edit-btn" onclick="openAdsConfigModal()">Configure ID</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * ============================================================================
   * ZONE 4: Video Slider MultiTag Implementation
   * ============================================================================
   */
  initZone4VideoSlider() {
    const cfg = this.config.zone4_videoSlider;
    if (!cfg || !cfg.enabled) return;

    const sliderContainer = document.getElementById(cfg.containerId);
    if (!sliderContainer) return;

    if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_VIDEO_SLIDER_ZONE_ID") {
      // PRODUCTION MODE: Inject HilltopAds Video Slider MultiTag
      console.log(`[HilltopAds] Injected Zone 4 Video Slider (${cfg.zoneId})`);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
      script.async = true;
      sliderContainer.appendChild(script);
    } else {
      // DEMO MODE: Slide in corner video player preview
      setTimeout(() => {
        sliderContainer.innerHTML = `
          <div class="video-slider-box" id="cine-slider-box">
            <div class="slider-topbar">
              <div class="slider-brand">
                <span class="slider-live-dot"></span>
                <span class="slider-title">Zone 4: Video Slider MultiTag</span>
              </div>
              <div class="slider-actions">
                <button class="slider-btn-min" id="cine-slider-min" title="Minimize / Expand">&minus;</button>
                <button class="slider-btn-close" id="cine-slider-close" title="Dismiss Video Slider">&times;</button>
              </div>
            </div>
            <div class="slider-media-container" id="cine-slider-media">
              <div class="slider-cinema-canvas">
                <div class="slider-reel-anim">
                  <div class="reel-circle"></div>
                  <div class="reel-glow"></div>
                  <span class="reel-play-symbol">▶</span>
                </div>
                <div class="slider-text-overlay">
                  <span class="slider-sponsor-tag">${cfg.demoTag}</span>
                  <h5 class="slider-movie-headline">Next-Gen Cinema 4K Laser Projection</h5>
                  <p class="slider-movie-sub">HilltopAds High-CPM Outstream Video MultiTag</p>
                </div>
              </div>
            </div>
            <div class="slider-footer-row">
              <span class="slider-zone-badge">Zone: <code>${cfg.zoneId}</code></span>
              <a href="${this.config.zone5_directLink.smartLinkUrl}" target="_blank" rel="noopener" class="slider-cta-link direct-link-trigger">Explore 4K Tech &rarr;</a>
            </div>
          </div>
        `;

        sliderContainer.classList.add("slider-open");

        const closeBtn = document.getElementById("cine-slider-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            sliderContainer.classList.remove("slider-open");
          });
        }

        const minBtn = document.getElementById("cine-slider-min");
        if (minBtn) {
          let minimized = false;
          minBtn.addEventListener("click", () => {
            minimized = !minimized;
            sliderContainer.classList.toggle("slider-collapsed", minimized);
            minBtn.innerHTML = minimized ? "&#43;" : "&minus;";
          });
        }
      }, cfg.autoSlideDelayMs || 2500);
    }
  }

  /**
   * ============================================================================
   * ZONE 5: Direct Link / SmartLink Implementation
   * ============================================================================
   */
  initZone5DirectLinks() {
    const cfg = this.config.zone5_directLink;
    if (!cfg || !cfg.enabled) return;

    const selectorQuery = cfg.selectors.join(", ");
    const buttons = document.querySelectorAll(selectorQuery);

    buttons.forEach((btn) => {
      // Check if already bound
      if (btn.dataset.smartlinkBound) return;
      btn.dataset.smartlinkBound = "true";

      btn.addEventListener("click", (e) => {
        const action = btn.dataset.action;
        const btnText = btn.textContent.trim();

        // If in Demo Mode with unconfigured SmartLink URL
        if (this.config.isDemoMode && cfg.smartLinkUrl.includes("YOUR_SMARTLINK_ZONE_ID")) {
          // Allow normal UI behavior (e.g. playing trailer or opening showtimes modal) while showing monetized toast notification
          this.showToastNotification(
            "Zone 5: Direct Link / SmartLink Triggered",
            `Button <strong>"${btnText.slice(0, 32)}..."</strong> routes traffic via HilltopAds SmartLink. In live production, this redirects visitors or opens in a new tab to monetize moviegoers searching for tickets, streams, or 4K trailers.`,
            "smartlink"
          );
        } else {
          // Production Mode: Open live SmartLink
          if (cfg.openInNewTab) {
            window.open(cfg.smartLinkUrl, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = cfg.smartLinkUrl;
          }
        }
      });
    });
  }

  /**
   * ============================================================================
   * ZONE 6: Video VAST (Integrated into HTML5 Trailer Player)
   * ============================================================================
   */
  initZone6VideoVAST() {
    const cfg = this.config.zone6_videoVAST;
    if (!cfg || !cfg.enabled) return;

    const player = document.getElementById(cfg.videoPlayerId);
    const overlay = document.getElementById(cfg.adOverlayId);

    if (!player || !overlay) {
      console.warn("[HilltopAds] Video player or VAST overlay container not found in DOM");
      return;
    }

    // Connect to external trailer selection
    window.triggerCinePulseVastAd = (trailerCallback) => {
      this.playVastPreRoll(player, overlay, cfg, trailerCallback);
    };

    // Pre-roll trigger when user directly hits the custom trailer play button
    const bigPlayBtn = document.getElementById("trailer-play-trigger");
    if (bigPlayBtn) {
      bigPlayBtn.addEventListener("click", () => {
        if (!this.vastCompleted) {
          this.playVastPreRoll(player, overlay, cfg, () => {
            player.play().catch(e => console.log("Player play triggered:", e));
          });
        } else {
          player.play().catch(e => console.log(e));
        }
      });
    }

    // Intercept native video play event if VAST has not yet executed
    player.addEventListener("play", (e) => {
      if (!this.vastCompleted && !this.isVastPlaying) {
        e.preventDefault();
        player.pause();
        this.playVastPreRoll(player, overlay, cfg, () => {
          player.play().catch(err => console.log(err));
        });
      }
    });

    // Optional mid-roll cue point simulation at 50% video progress
    let midRollTriggered = false;
    player.addEventListener("timeupdate", () => {
      if (player.duration && player.currentTime > (player.duration * 0.5) && !midRollTriggered) {
        midRollTriggered = true;
        console.log("[HilltopAds] Mid-roll cue point reached at 50% trailer timeline.");
      }
    });
  }

  playVastPreRoll(player, overlay, cfg, onComplete) {
    if (this.isVastPlaying) return;
    this.isVastPlaying = true;
    player.pause();

    overlay.classList.add("vast-active");
    let timeLeft = cfg.skipTimeSeconds || 5;
    let totalAdDuration = cfg.adDurationSeconds || 15;

    const adTimeDisplay = overlay.querySelector(".vast-timer-digits");
    const skipBtn = overlay.querySelector(".vast-skip-button");
    const progressBar = overlay.querySelector(".vast-bar-fill");
    const sponsorCta = overlay.querySelector(".vast-sponsor-btn");

    if (adTimeDisplay) adTimeDisplay.textContent = `0:${totalAdDuration < 10 ? '0' + totalAdDuration : totalAdDuration}`;
    if (skipBtn) {
      skipBtn.disabled = true;
      skipBtn.classList.remove("skip-ready");
      skipBtn.innerHTML = `Skip Ad in <strong>${timeLeft}s</strong>`;
    }
    if (progressBar) {
      progressBar.style.width = "0%";
    }

    if (sponsorCta) {
      sponsorCta.onclick = (e) => {
        e.preventDefault();
        window.open(this.config.zone5_directLink.smartLinkUrl, "_blank", "noopener,noreferrer");
      };
    }

    const timerInterval = setInterval(() => {
      timeLeft--;
      totalAdDuration--;

      if (adTimeDisplay) {
        adTimeDisplay.textContent = `0:${totalAdDuration < 10 ? '0' + totalAdDuration : totalAdDuration}`;
      }

      if (progressBar) {
        const pct = ((cfg.adDurationSeconds - totalAdDuration) / cfg.adDurationSeconds) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      }

      if (timeLeft <= 0 && skipBtn && skipBtn.disabled) {
        skipBtn.disabled = false;
        skipBtn.classList.add("skip-ready");
        skipBtn.innerHTML = `Skip Ad <span class="vast-skip-arrow">&#10148;</span>`;
      }

      if (totalAdDuration <= 0) {
        finishAd();
      }
    }, 1000);

    const finishAd = () => {
      clearInterval(timerInterval);
      overlay.classList.remove("vast-active");
      this.isVastPlaying = false;
      this.vastCompleted = true;

      this.showToastNotification(
        "Zone 6: Video VAST Completed",
        `VAST Pre-roll commercial finished. Now streaming the movie trailer in High Definition. In production, HilltopAds VAST Tag URL delivers video creatives automatically.`,
        "vast"
      );

      if (typeof onComplete === "function") {
        onComplete();
      }
    };

    if (skipBtn) {
      skipBtn.onclick = (e) => {
        e.stopPropagation();
        if (timeLeft <= 0) {
          finishAd();
        }
      };
    }
  }

  /**
   * ============================================================================
   * Modal and Toast Helpers
   * ============================================================================
   */
  setupConfigModal() {
    window.openAdsConfigModal = () => {
      const modal = document.getElementById("cine-ads-modal");
      if (modal) modal.classList.add("modal-open");
    };

    window.closeAdsConfigModal = () => {
      const modal = document.getElementById("cine-ads-modal");
      if (modal) modal.classList.remove("modal-open");
    };
  }

  showToastNotification(title, message, category = "info") {
    let container = document.getElementById("cine-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "cine-toast-container";
      container.className = "cine-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `cine-toast toast-category-${category}`;

    let icon = "⚡";
    if (category === "popunder") icon = "🚀";
    if (category === "smartlink") icon = "🔗";
    if (category === "vast") icon = "🎬";

    toast.innerHTML = `
      <div class="toast-head">
        <span class="toast-symbol">${icon}</span>
        <strong class="toast-title-text">${title}</strong>
        <button class="toast-dismiss" aria-label="Dismiss">&times;</button>
      </div>
      <div class="toast-content-text">${message}</div>
    `;

    container.appendChild(toast);

    const dismissBtn = toast.querySelector(".toast-dismiss");
    if (dismissBtn) {
      dismissBtn.onclick = () => {
        toast.classList.add("toast-slide-out");
        setTimeout(() => toast.remove(), 350);
      };
    }

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add("toast-slide-out");
        setTimeout(() => toast.remove(), 350);
      }
    }, 6500);
  }
}

// Auto-instantiate when document is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cinePulseAds = new HilltopAdsCinemaManager(CINEPULSE_ADS_CONFIG);
  window.cinePulseAds.init();
});
