import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { useToast } from "@/components/ui/use-toast";

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
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

  return (
    <section id="contact" className="px-6 py-16 md:px-12 lg:px-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ color: "#2C4848" }}>
            Contact Me
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's work together! I'm always interested in new opportunities and exciting projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                {/* SVG Email Icon */}
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">gurangjayjason@gmail.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                {/* SVG Location Icon */}
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">Davao City, Philippines</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                {/* SVG Phone Icon */}
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+63 947 739 7934</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full font-medium py-3 px-6 rounded-lg transition-colors ${
                isSending
                  ? "bg-orange-300 text-gray-700 cursor-not-allowed"
                  : "bg-orange-400 hover:bg-orange-500 text-gray-900"
              }`}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
