import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(value: string): string {
    if (!value.trim()) return "Email is required.";
    if (!value.includes("@") || !value.includes("."))
      return "Please enter a valid email address.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(email);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success(
        "Thank you for subscribing! 🎉 Check your inbox for exclusive deals.",
      );
    }, 800);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (error) setError(validate(e.target.value));
  }

  return (
    <section
      className="py-16"
      style={{ backgroundColor: "var(--color-primary)" }}
      data-ocid="newsletter.section"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full border"
          style={{
            color: "var(--color-accent)",
            borderColor: "var(--color-accent)",
          }}
        >
          Newsletter
        </span>
        <h2
          className="text-2xl sm:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Stay Updated with Our Latest Offers
        </h2>
        <p className="text-white/70 mb-8 text-base max-w-lg mx-auto">
          Subscribe to get exclusive deals, new arrivals and more delivered to
          your inbox. No spam, ever.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleChange}
                className="h-12 text-foreground bg-white/10 border-white/20 placeholder:text-white/40 text-white focus:border-accent"
                aria-label="Email address"
                data-ocid="newsletter.email_input"
              />
              {error && (
                <p
                  className="text-red-400 text-xs mt-1 text-left"
                  data-ocid="newsletter.field_error"
                >
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 font-semibold text-white min-h-[44px] shrink-0"
              style={{ backgroundColor: "var(--color-accent)" }}
              data-ocid="newsletter.submit_button"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form>

        <p className="text-white/40 text-xs mt-4">
          By subscribing, you agree to receive marketing emails. Unsubscribe
          anytime.
        </p>
      </div>
    </section>
  );
}
