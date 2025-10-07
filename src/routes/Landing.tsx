import "@/assets/pages/landing.less";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button.tsx";
import { appLogo, appName } from "@/conf/env.ts";
import { goAuth } from "@/utils/app.ts";
import router from "@/router.tsx";
import {
    BookOpen,
    Brain,
    Users,
    Sparkles,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

function Landing() {
    const { t } = useTranslation();

    const features = [
        {
            icon: <BookOpen className={`feature-icon`} />,
            title: t("landing.feature-learn-title"),
            description: t("landing.feature-learn-desc"),
        },
        {
            icon: <Brain className={`feature-icon`} />,
            title: t("landing.feature-ai-title"),
            description: t("landing.feature-ai-desc"),
        },
        {
            icon: <Users className={`feature-icon`} />,
            title: t("landing.feature-partner-title"),
            description: t("landing.feature-partner-desc"),
        },
        {
            icon: <Sparkles className={`feature-icon`} />,
            title: t("landing.feature-smart-title"),
            description: t("landing.feature-smart-desc"),
        },
    ];

    const highlights = [
        t("landing.highlight-1"),
        t("landing.highlight-2"),
        t("landing.highlight-3"),
        t("landing.highlight-4"),
    ];

    return (
        <div className={`landing`}>
            <div className={`landing-container`}>
                {/* Hero Section */}
                <section className={`hero-section`}>
                    <div className={`hero-content`}>
                        <img className={`hero-logo`} src={appLogo} alt={appName} />
                        <h1 className={`hero-title`}>{t("landing.hero-title")}</h1>
                        <p className={`hero-subtitle`}>{t("landing.hero-subtitle")}</p>

                        <div className={`hero-actions`}>
                            <Button
                                size={`lg`}
                                className={`primary-action`}
                                onClick={goAuth}
                            >
                                {t("landing.get-started")}
                                <ArrowRight className={`ml-2 h-5 w-5`} />
                            </Button>
                            <Button
                                size={`lg`}
                                variant={`outline`}
                                className={`secondary-action`}
                                onClick={() => router.navigate("/register")}
                            >
                                {t("landing.create-account")}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className={`features-section`}>
                    <h2 className={`section-title`}>{t("landing.features-title")}</h2>
                    <div className={`features-grid`}>
                        {features.map((feature, index) => (
                            <div key={index} className={`feature-card`}>
                                <div className={`feature-icon-wrapper`}>{feature.icon}</div>
                                <h3 className={`feature-title`}>{feature.title}</h3>
                                <p className={`feature-description`}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Highlights Section */}
                <section className={`highlights-section`}>
                    <h2 className={`section-title`}>{t("landing.why-choose")}</h2>
                    <div className={`highlights-list`}>
                        {highlights.map((highlight, index) => (
                            <div key={index} className={`highlight-item`}>
                                <CheckCircle2 className={`highlight-icon`} />
                                <span>{highlight}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className={`cta-section`}>
                    <div className={`cta-content`}>
                        <h2 className={`cta-title`}>{t("landing.cta-title")}</h2>
                        <p className={`cta-subtitle`}>{t("landing.cta-subtitle")}</p>
                        <Button size={`lg`} className={`cta-button`} onClick={goAuth}>
                            {t("landing.start-chatting")}
                            <ArrowRight className={`ml-2 h-5 w-5`} />
                        </Button>
                    </div>
                </section>

                {/* Footer */}
                <footer className={`landing-footer`}>
                    <p className={`footer-text`}>
                        © 2025 {appName}. {t("landing.footer-rights")}
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default Landing;
