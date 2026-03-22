"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TrackingForm from "@/components/TrackingForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gray-900 text-white min-h-[650px] lg:min-h-[750px]">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source
            src="https://res.cloudinary.com/dpwddkw5t/video/upload/v1770818185/219046_medium_if3trc.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
        {/* Accent glows */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-700 rounded-full filter blur-[180px] opacity-15" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-700 rounded-full filter blur-[140px] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-blue-300 text-sm font-medium mb-6 border border-white/10">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Trusted by 50,000+ customers worldwide
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Global Logistics{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                  &amp; Shipping
                </span>{" "}
                Solutions
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed">
                SpikeXlogistics is your trusted global supply-chain partner, delivering parcels safely and on time across 20+ countries with real-time tracking and full insurance coverage.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="#track"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Track Package
                </Link>
                <Link
                  href="/send"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
                >
                  Get a Quote
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: Floating stat cards */}
            <div className="hidden lg:flex justify-center items-center relative min-h-[400px]">
              <div className="absolute top-4 right-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-extrabold text-white">99.8%</p>
                  <p className="text-sm text-gray-400 mt-1">On-Time Delivery</p>
                </div>
              </div>
              <div className="absolute top-36 left-4 animate-scale-in" style={{ animationDelay: "0.4s" }}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
                    </svg>
                  </div>
                  <p className="text-3xl font-extrabold text-white">20+</p>
                  <p className="text-sm text-gray-400 mt-1">Countries Served</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-16 animate-scale-in" style={{ animationDelay: "0.6s" }}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-extrabold text-white">24/7</p>
                  <p className="text-sm text-gray-400 mt-1">Expert Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUSTED PARTNERS STRIP ─── */}
      <section className="bg-gray-50 py-12 sm:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-20 opacity-40">
            {["DHL", "FedEx", "Maersk", "Amazon", "UPS"].map((name) => (
              <div key={name} className="flex items-center">
                <svg width="120" height="40" viewBox="0 0 120 40" className="text-gray-600">
                  <text
                    x="60"
                    y="28"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontWeight="800"
                    fontSize="22"
                    fill="currentColor"
                    letterSpacing="2"
                  >
                    {name}
                  </text>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRACKING SECTION ─── */}
      <section id="track" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-700 via-blue-700 to-blue-800 rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-700/20">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Real-Time Package Tracking
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Track Your Package</h2>
              <p className="text-blue-100 mb-10 max-w-lg mx-auto text-lg">
                Enter your SpikeX tracking code to get instant updates on your shipment&apos;s location and estimated delivery time.
              </p>
              <div className="max-w-xl mx-auto">
                <TrackingForm large />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─── */}
      <section id="services" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Our Logistics Services
            </h2>
            <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive transport and supply-chain solutions tailored to meet your shipping needs across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Air Freight",
                desc: "Express air cargo delivery for time-critical shipments to any destination worldwide with real-time flight tracking and priority handling.",
                icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5",
                color: "bg-blue-50 text-blue-600",
                iconBg: "bg-blue-100",
              },
              {
                title: "Ground Shipping",
                desc: "Reliable road freight and last-mile delivery with comprehensive national coverage, flexible scheduling, and real-time route optimization.",
                icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
                color: "bg-blue-50 text-blue-700",
                iconBg: "bg-blue-100",
              },
              {
                title: "Sea Freight",
                desc: "Cost-effective ocean cargo solutions for large shipments with full container load (FCL) and less-than-container load (LCL) options.",
                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
                color: "bg-cyan-50 text-cyan-600",
                iconBg: "bg-cyan-100",
              },
              {
                title: "Real-Time Tracking",
                desc: "Monitor every parcel with live GPS tracking, instant push notifications, SMS alerts, and ETAs updated every 30 seconds.",
                icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                color: "bg-green-50 text-green-600",
                iconBg: "bg-green-100",
              },
              {
                title: "Warehousing",
                desc: "Secure climate-controlled storage facilities with inventory management, pick-and-pack fulfillment, and distribution services.",
                icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21",
                color: "bg-purple-50 text-purple-600",
                iconBg: "bg-purple-100",
              },
              {
                title: "Insurance Coverage",
                desc: "Full cargo insurance with transparent pricing to protect your valuable shipments against loss, damage, or delays during transit.",
                icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
                color: "bg-amber-50 text-amber-600",
                iconBg: "bg-amber-100",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <svg className={`w-7 h-7 ${service.color.split(" ")[1]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.desc}</p>
                <Link href="#" className="inline-flex items-center gap-1 text-blue-700 text-sm font-semibold hover:text-blue-800 transition-colors group-hover:gap-2">
                  Learn more
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="how-it-works"
        className="parallax-bg py-20 sm:py-28 relative text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">How It Works</h2>
            <p className="mt-5 text-gray-300 max-w-xl mx-auto text-lg">
              Getting your parcel from point A to point B has never been easier. Four simple steps to delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-6 relative">
            {/* Connecting dotted line (desktop only) */}
            <div className="hidden md:block absolute top-14 left-[16%] right-[16%] border-t-2 border-dashed border-white/20" />

            {[
              {
                step: "01",
                title: "Register Parcel",
                desc: "Contact us or visit any of our office branches to register your shipment for delivery.",
                icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15",
              },
              {
                step: "02",
                title: "Get Tracking Code",
                desc: "Receive a unique SpikeX tracking code via email once your shipment is confirmed and dispatched.",
                icon: "M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                step: "03",
                title: "Track Real-Time",
                desc: "Enter your tracking code on our website for live updates on location and delivery status.",
                icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
              },
              {
                step: "04",
                title: "Safe Delivery",
                desc: "Your package is delivered to the destination safely, on time, and with full insurance coverage.",
                icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="w-28 h-28 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-3xl flex flex-col items-center justify-center mx-auto mb-6 relative z-10 group-hover:border-blue-400/50 group-hover:from-blue-700/20 group-hover:to-blue-700/10 transition-all duration-300">
                  <svg className="w-8 h-8 text-blue-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-[11px] font-bold text-blue-400/80 tracking-wider">STEP {item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-[240px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-700 font-semibold text-sm uppercase tracking-widest mb-3">Why SpikeXlogistics</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Safety, Speed &amp; Reliability at Competitive Prices
              </h2>
              <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                We are a trusted global logistics partner known for delivering parcels safely and on time.
                With transparent pricing and full insurance coverage, even budget-conscious senders
                get premium service quality.
              </p>
              <div className="space-y-5">
                {[
                  "Transparent pricing with no hidden fees",
                  "Full cargo insurance on every shipment",
                  "99.8% on-time delivery guarantee",
                  "Real-time tracking with instant notifications",
                  "24/7 dedicated customer support team",
                  "Cost optimization for bulk shipments",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-blue-700/30">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-lg">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  href="/send"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:-translate-y-0.5"
                >
                  Get Started
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right side: illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 rounded-3xl" />
                <div className="relative bg-white rounded-3xl p-10 border border-gray-200 shadow-xl">
                  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    {/* Background grid */}
                    <rect width="400" height="300" rx="12" fill="#FAFAFA" />
                    {/* Globe */}
                    <circle cx="200" cy="150" r="110" stroke="#E5E7EB" strokeWidth="1" />
                    <circle cx="200" cy="150" r="80" stroke="#E5E7EB" strokeWidth="1" />
                    <circle cx="200" cy="150" r="50" stroke="#E5E7EB" strokeWidth="1" />
                    <ellipse cx="200" cy="150" rx="110" ry="45" stroke="#E5E7EB" strokeWidth="1" />
                    <ellipse cx="200" cy="150" rx="45" ry="110" stroke="#E5E7EB" strokeWidth="1" />
                    {/* Route lines */}
                    <path d="M100 120 Q 150 80, 200 100 T 310 130" stroke="#1D4ED8" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.6" />
                    <path d="M120 180 Q 180 220, 250 170 T 340 160" stroke="#1D4ED8" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.4" />
                    {/* Location nodes */}
                    <circle cx="100" cy="120" r="8" fill="#1D4ED8" opacity="0.9">
                      <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="100" r="6" fill="#2563EB" />
                    <circle cx="310" cy="130" r="8" fill="#1D4ED8" opacity="0.9">
                      <animate attributeName="r" values="8;10;8" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="120" cy="180" r="5" fill="#60A5FA" />
                    <circle cx="250" cy="170" r="6" fill="#2563EB" />
                    <circle cx="340" cy="160" r="5" fill="#60A5FA" />
                    <circle cx="170" cy="130" r="4" fill="#FCA5A5" />
                    <circle cx="280" cy="110" r="4" fill="#FCA5A5" />
                    {/* Package icon center */}
                    <rect x="175" y="125" width="50" height="50" rx="8" fill="#1D4ED8" />
                    <path d="M185 150 L200 140 L215 150 L200 160 Z" fill="white" opacity="0.9" />
                    <line x1="200" y1="140" x2="200" y2="160" stroke="white" strokeWidth="1" opacity="0.5" />
                    {/* Label */}
                    <text x="200" y="285" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="600" fill="#6B7280">Global Delivery Network</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
            <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
              Hear from businesses and individuals who trust SpikeXlogistics for their shipping needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "SpikeXlogistics transformed our supply chain operations. Their real-time tracking and consistent on-time delivery have made them an indispensable partner for our e-commerce business.",
                name: "Sarah Mitchell",
                company: "TechVentures Inc.",
                role: "Head of Operations",
                stars: 5,
              },
              {
                quote: "We switched from a major carrier to SpikeXlogistics and saw a 30% reduction in shipping costs with better delivery times. The customer support team is incredibly responsive and helpful.",
                name: "James Okonkwo",
                company: "AfriMart Global",
                role: "CEO",
                stars: 5,
              },
              {
                quote: "The insurance coverage and transparent pricing gave us peace of mind when shipping high-value electronics internationally. Every package arrived safely, every single time.",
                name: "Elena Rodriguez",
                company: "NovaTech Solutions",
                role: "Logistics Manager",
                stars: 5,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6">
                  <svg className="w-10 h-10 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                  </svg>
                </div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-11 h-11 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="relative overflow-hidden py-20 sm:py-28 text-white">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source
            src="https://res.cloudinary.com/dpwddkw5t/video/upload/v1770818185/219046_medium_if3trc.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 to-gray-900/50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-blue-300 text-sm font-medium mb-6 border border-white/10">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Start Shipping Today
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to Ship?
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg">
            Join thousands of satisfied customers. Get competitive rates, fast delivery, and full transparency on every shipment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/send"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              Send a Parcel
            </Link>
            <Link
              href="#track"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
            >
              Track a Shipment
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
