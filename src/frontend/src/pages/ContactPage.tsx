import { Link } from "@tanstack/react-router";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { postContactForm } from "../lib/api/contact";
import type { ContactFormData } from "../types";

// --- Types ---

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// --- Helpers ---

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^\d{10}$/.test(phone.replace(/\s/g, ""));
}

function validateForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = "Phone must be a 10-digit number.";
  }
  if (!data.subject) errors.subject = "Please select a subject.";
  if (!data.message.trim()) {
    errors.message = "Message is required.";
  } else if (data.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters.";
  }
  return errors;
}

const SUBJECT_OPTIONS = [
  { value: "", label: "Select a subject" },
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Product Question", label: "Product Question" },
  { value: "Order Support", label: "Order Support" },
  { value: "Return/Refund", label: "Return/Refund" },
  { value: "Other", label: "Other" },
];

const CONTACT_INFO = [
  {
    icon: <MapPin className="w-5 h-5 shrink-0" />,
    text: "123 E-Commerce Street, Mumbai, Maharashtra 400001",
  },
  {
    icon: <Phone className="w-5 h-5 shrink-0" />,
    text: "+91 1800-000-0000",
  },
  {
    icon: <Mail className="w-5 h-5 shrink-0" />,
    text: "support@myecom.com",
  },
  {
    icon: <Clock className="w-5 h-5 shrink-0" />,
    text: "Mon–Sat: 9:00 AM – 6:00 PM",
  },
];

const SOCIAL_LINKS = [
  {
    icon: <Instagram className="w-5 h-5" />,
    label: "Instagram",
    href: "https://instagram.com",
  },
  {
    icon: <Facebook className="w-5 h-5" />,
    label: "Facebook",
    href: "https://facebook.com",
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    label: "Twitter",
    href: "https://twitter.com",
  },
  {
    icon: <Youtube className="w-5 h-5" />,
    label: "YouTube",
    href: "https://youtube.com",
  },
];

// --- Sub-components ---

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="text-sm mt-1"
      style={{ color: "var(--color-error)" }}
      role="alert"
      data-ocid="contact.field_error"
    >
      {message}
    </p>
  );
}

function SuccessCard() {
  return (
    <div
      data-ocid="contact.success_state"
      className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl"
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "rgba(40,167,69,0.12)" }}
      >
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ color: "var(--color-success)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3
        className="text-2xl font-bold mb-3"
        style={{
          color: "var(--color-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        Thank You!
      </h3>
      <p
        className="text-base max-w-xs"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Your message has been received. We'll get back to you within 24 hours.
      </p>
    </div>
  );
}

// --- Main Page ---

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await postContactForm(form);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      {/* Page Header */}
      <section
        className="py-12 px-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <nav
            className="flex items-center gap-2 text-sm mb-4"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              style={{ color: "rgba(255,255,255,0.55)" }}
              className="hover:text-white transition-colors"
              data-ocid="breadcrumb.home_link"
            >
              Home
            </Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "var(--color-accent)" }}>Contact</span>
          </nav>
          <h1
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact Us
          </h1>
          <p
            className="mt-2 text-base"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Have a question or need help? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Contact Form */}
          <div>
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Send Us a Message
            </h2>

            {submitted ? (
              <SuccessCard />
            ) : (
              <form
                data-ocid="contact.form"
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                {/* Name */}
                <div>
                  <Label
                    htmlFor="contact-name"
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Full Name{" "}
                    <span style={{ color: "var(--color-accent)" }}>*</span>
                  </Label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-1"
                    style={{ minHeight: "44px" }}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    data-ocid="contact.name.input"
                  />
                  <FieldError message={errors.name} />
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="contact-email"
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Email Address{" "}
                    <span style={{ color: "var(--color-accent)" }}>*</span>
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mt-1"
                    style={{ minHeight: "44px" }}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    data-ocid="contact.email.input"
                  />
                  <FieldError message={errors.email} />
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="contact-phone"
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Phone Number{" "}
                    <span
                      style={{ color: "var(--color-text-muted)" }}
                      className="text-xs font-normal"
                    >
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone ?? ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-1"
                    style={{ minHeight: "44px" }}
                    aria-invalid={!!errors.phone}
                    data-ocid="contact.phone.input"
                  />
                  <FieldError message={errors.phone} />
                </div>

                {/* Subject */}
                <div>
                  <Label
                    htmlFor="contact-subject"
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Subject{" "}
                    <span style={{ color: "var(--color-accent)" }}>*</span>
                  </Label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 transition-smooth"
                    style={{
                      minHeight: "44px",
                      borderColor: errors.subject
                        ? "var(--color-error)"
                        : "var(--color-border)",
                      background: "var(--color-surface)",
                      color: form.subject
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    data-ocid="contact.subject.select"
                  >
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.value === ""}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.subject} />
                </div>

                {/* Message */}
                <div>
                  <Label
                    htmlFor="contact-message"
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Message{" "}
                    <span style={{ color: "var(--color-accent)" }}>*</span>
                  </Label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us how we can help you... (min. 20 characters)"
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:ring-2 transition-smooth resize-y"
                    style={{
                      borderColor: errors.message
                        ? "var(--color-error)"
                        : "var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-body)",
                      minHeight: "120px",
                    }}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    data-ocid="contact.message.textarea"
                  />
                  <div className="flex justify-between items-start mt-1">
                    <FieldError message={errors.message} />
                    <span
                      className="text-xs ml-auto"
                      style={{
                        color:
                          form.message.length < 20
                            ? "var(--color-text-muted)"
                            : "var(--color-success)",
                      }}
                    >
                      {form.message.length}/20 min
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold text-white"
                  style={{
                    background: "var(--color-accent)",
                    minHeight: "48px",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  data-ocid="contact.submit_button"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Right: Contact Info */}
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Get in Touch
              </h2>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                We're here to help. Reach out to us via any of the channels
                below.
              </p>
            </div>

            {/* Info Items */}
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{
                background: "var(--color-surface)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {CONTACT_INFO.map((item) => (
                <div key={item.text} className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-xl shrink-0"
                    style={{
                      background: "rgba(233,69,96,0.1)",
                      color: "var(--color-accent)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <p
                    className="text-sm leading-relaxed pt-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h3
                className="font-semibold mb-3 text-base"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-smooth hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-secondary)",
                      boxShadow: "var(--shadow-card)",
                      border: "1px solid var(--color-border)",
                    }}
                    data-ocid={`contact.social.${link.label.toLowerCase()}.link`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map Embed */}
            <div>
              <h3
                className="font-semibold mb-3 text-base"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Our Location
              </h3>
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  boxShadow: "var(--shadow-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609232527!2d72.74109995!3d19.08219785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1609459200000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="My E-Com Office Location — Mumbai, Maharashtra"
                />
              </div>
            </div>

            {/* Response Time Banner */}
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background: "rgba(40,167,69,0.08)",
                border: "1px solid rgba(40,167,69,0.2)",
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(40,167,69,0.15)",
                  color: "var(--color-success)",
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-success)" }}
                >
                  Average response time: &lt; 24 hours
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Our support team is available Mon–Sat, 9 AM–6 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
