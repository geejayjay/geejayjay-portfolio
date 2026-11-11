import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/hooks/ThemeContext";
import { Page, Reveal, SectionHeading } from "./Page";

const details = [
  {
    icon: Mail,
    label: "Email",
    value: "gurangjayjason@gmail.com",
    href: "mailto:gurangjayjason@gmail.com",
  },
  { icon: MapPin, label: "Location", value: "Davao City, Philippines" },
  { icon: Phone, label: "Phone", value: "+63 947 739 7934", href: "tel:+639477397934" },
];

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const { isDark } = useTheme();

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Honeypot check: if filled, quietly succeed to foil bots without sending via EmailJS
    const formData = new FormData(formRef.current);
    if (formData.get("_gotcha")) {
      toast({
        variant: "default",
        title: "Email sent",
        description: "Your email has been sent successfully.",
      });
      formRef.current.reset();
      return;
    }

    setIsSending(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!,
      );

      toast({
        variant: "default",
        title: "Email sent",
        description: "Your email has been sent successfully.",
      });

      formRef.current?.reset();
    } catch (error) {
      console.error("EmailJS sendForm error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error sending your email.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const labelClass = isDark
    ? "mb-2 block font-mono text-xs text-brand2"
    : "mb-1 block font-hand text-xl text-ink";

  return (
    <Page id="contact">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading note="say hello" comment="// 05 — contact" title="Let's Talk">
            Let's work together! I'm always interested in new opportunities and exciting projects.
          </SectionHeading>

          <ul className="mt-10 space-y-5">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4">
                <span
                  className={
                    "flex h-12 w-12 shrink-0 items-center justify-center text-brand " +
                    (isDark
                      ? "rounded-md border border-brand/25 bg-brand/5"
                      : "rounded-[50%_44%_56%_46%] bg-brand2/30")
                  }
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className={isDark ? "font-mono text-xs text-soft" : "text-sm text-soft"}>
                    {isDark ? `${label.toLowerCase()}:` : label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="font-medium text-ink transition-colors hover:text-brand"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium text-ink">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12}>
          <form ref={formRef} onSubmit={sendEmail} className="surface space-y-5 p-6 sm:p-8">
            {/* Honeypot field to block automated bot submissions */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div>
              <label htmlFor="name" className={labelClass}>
                {isDark ? "name:" : "Your name"}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="field"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                {isDark ? "email:" : "Your email"}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="field"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                {isDark ? "message:" : "What's on your mind?"}
              </label>
              <textarea
                name="message"
                id="message"
                rows={5}
                required
                className="field resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button type="submit" disabled={isSending} className="btn btn-primary w-full">
              <Send className="h-4 w-4" />
              {isSending ? "Sending..." : isDark ? "send()" : "Send Message"}
            </button>
          </form>
        </Reveal>
      </div>

      <p
        className={
          "mt-16 text-center text-soft " + (isDark ? "font-mono text-xs" : "font-hand text-xl")
        }
      >
        {isDark
          ? `/* © ${new Date().getFullYear()} Jason Jay Gurang — compiled with zero warnings */`
          : `© ${new Date().getFullYear()} Jason Jay Gurang — painted with a little wonder`}
      </p>
    </Page>
  );
}
