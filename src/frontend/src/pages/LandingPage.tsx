import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BadgeIndianRupee,
  Clock,
  Coins,
  Gift,
  LogIn,
  ShieldCheck,
  TrendingUp,
  Tv2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stats = [
  {
    icon: Tv2,
    value: "1000+",
    label: "Ads Available",
    color: "from-orange-400 to-red-500",
  },
  {
    icon: BadgeIndianRupee,
    value: "₹0.10",
    label: "Per Point Earned",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Clock,
    value: "24 hrs",
    label: "UPI Payout Time",
    color: "from-violet-500 to-purple-600",
  },
];

const features = [
  {
    icon: Coins,
    title: "Earn Points Instantly",
    description:
      "Watch any ad for 15 seconds and points land in your wallet immediately — no waiting, no tricks.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: BadgeIndianRupee,
    title: "Cash via UPI",
    description:
      "Redeem your points for real INR directly to your UPI ID. Fast, familiar, no bank account needed.",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: Gift,
    title: "Gift Cards Too",
    description:
      "Prefer vouchers? Exchange points for popular gift cards from top brands instead.",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description:
      "Your identity and earnings are protected by Internet Identity — no passwords, no data leaks.",
    gradient: "from-violet-500 to-indigo-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign In",
    description:
      "Login securely with Internet Identity — one click, no password.",
    icon: LogIn,
  },
  {
    step: "02",
    title: "Watch Ads",
    description: "Pick any ad, watch 15 seconds, and earn points instantly.",
    icon: Tv2,
  },
  {
    step: "03",
    title: "Get Paid",
    description: "Redeem your points for cash via UPI within 24 hours.",
    icon: BadgeIndianRupee,
  },
];

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-500/15 to-indigo-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-gradient-to-r from-amber-300/10 to-orange-300/10 blur-2xl" />
        </div>

        <div className="container">
          <motion.div
            className="mx-auto max-w-4xl text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400">
                <Zap className="h-3.5 w-3.5" />
                India's Easiest Way to Earn Online
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl">
                Watch Ads.{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Earn Real Money.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Turn your spare time into real rupees. Watch short ads, collect
                points, and withdraw straight to your{" "}
                <strong className="text-foreground">UPI ID</strong> — usually
                within 24 hours.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-2 text-base h-12 px-8 font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                data-ocid="landing.get_started_button"
              >
                {isLoggingIn ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Start Earning Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Free to join · No credit card needed
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-6 py-5 shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-extrabold font-display text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium text-center">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-3"
            >
              <h2 className="font-display text-4xl font-bold text-foreground">
                Everything you need to earn
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Simple, transparent, and genuinely rewarding. Here's what makes
                our platform different.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  transition={{ delay: i * 0.08 }}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  data-ocid={`landing.feature.card.${i + 1}`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container">
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-3"
            >
              <h2 className="font-display text-4xl font-bold text-foreground">
                How it works
              </h2>
              <p className="text-muted-foreground">
                Three simple steps to your first payout.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-border via-primary/40 to-border" />

              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={itemVariants}
                  transition={{ delay: i * 0.12 }}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/40">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold font-display">
                      {i + 1}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-8 py-14 text-center shadow-xl shadow-orange-300/30 dark:shadow-orange-900/30"
          >
            {/* Background blobs */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/10 blur-2xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative space-y-5">
              <div className="flex items-center justify-center gap-2 text-white/80 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Join thousands earning daily
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Ready to start earning?
              </h2>
              <p className="text-white/80 max-w-md mx-auto">
                Sign in now, watch your first ad in under a minute, and earn
                points you can withdraw to UPI.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-2 h-12 px-8 font-bold text-base bg-white text-orange-600 hover:bg-white/90 shadow-lg"
                data-ocid="landing.cta_button"
              >
                {isLoggingIn ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Get Started — It's Free
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
