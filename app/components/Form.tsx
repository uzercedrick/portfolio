"use client";
import { useState, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheck, MdErrorOutline, MdClose } from "react-icons/md";
import emailjs from "@emailjs/browser";
import { zalando } from "../fonts";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

// --------------------------
// EMAILJS CONFIGURATION
// --------------------------
const EMAILJS_SERVICE_ID = "service_y5r3fys";
const EMAILJS_TEMPLATE_ID = "template_5nh0po1";
const EMAILJS_PUBLIC_KEY = "Oa41jzssBxnxqW_HT";
const RECIPIENT_EMAIL = "jhoncedrick.fuentes@gmail.com";

// --------------------------
// RATE LIMITING — max 3 submissions per 10 minutes per session
// Stored in memory (resets on page refresh, no backend needed)
// --------------------------
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const submitTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  // Remove timestamps older than the window
  while (submitTimestamps.length && submitTimestamps[0] < now - RATE_LIMIT_MS) {
    submitTimestamps.shift();
  }
  return submitTimestamps.length >= RATE_LIMIT_MAX;
}

function recordSubmit() {
  submitTimestamps.push(Date.now());
}

// --------------------------
// INPUT SANITIZATION
// Strips HTML tags and trims whitespace to prevent XSS via rendered content
// --------------------------
function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, "") // strip any HTML tags
    .replace(/javascript:/gi, "") // block js: URIs
    .trim();
}

type ContactFormPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

// --------------------------
// Multi-Step Contact Form Popup
// --------------------------
export default function ContactFormPopup({ isOpen, onClose }: ContactFormPopupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    projectType: "",
    customProject: "",
    vision: ""
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    projectType: "",
    customProject: "",
    vision: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const totalSteps = 4;

  const progress = (step / totalSteps) * 100;

  const getCurrentDateTime = () => {
    return new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(new Date());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
    setSubmitError("");
  };

  const handleSelect = (type: string) => {
    setFormData({ ...formData, projectType: type, customProject: type === "OTHER" ? formData.customProject : "" });
    if (errors.projectType) setErrors({ ...errors, projectType: "" });
    setSubmitError("");
  };

  const validateStep = () => {
    const newErrors = { ...errors };
    let valid = true;

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Please enter your full name";
        valid = false;
      }
    }

    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = "Please enter your email address";
        valid = false;
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
        valid = false;
      }
    }

    if (step === 3) {
      if (!formData.projectType) {
        newErrors.projectType = "Please select a project type";
        valid = false;
      } else if (formData.projectType === "OTHER" && !formData.customProject.trim()) {
        newErrors.customProject = "Please describe your project type";
        valid = false;
      }
    }

    if (step === 4) {
      if (!formData.vision.trim()) {
        newErrors.vision = "Please tell me about your project";
        valid = false;
      } else if (formData.vision.trim().length < 10) {
        newErrors.vision = "Please provide a little more detail (at least 10 characters)";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < totalSteps) setStep(prev => prev + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
    setSubmitError("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !submitted && !loading) {
      e.preventDefault();
      nextStep();
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateStep()) return;

    // Rate limit check — prevents spam without a backend
    if (isRateLimited()) {
      setSubmitError("Too many submissions. Please wait a few minutes before trying again.");
      return;
    }

    setLoading(true);
    setSubmitError("");

    // Sanitize all user inputs before sending
    const safeName = sanitize(formData.fullName);
    const safeEmail = sanitize(formData.email);
    const safeProjectType = sanitize(
      formData.projectType === "OTHER" ? formData.customProject : formData.projectType
    );
    const safeVision = sanitize(formData.vision);
    const currentDateTime = getCurrentDateTime();

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: safeName,
          from_email: safeEmail,
          project_type: safeProjectType,
          message: safeVision.replace(/\n/g, "<br>"),
          date_time: currentDateTime,
          year: new Date().getFullYear(),
          to_email: RECIPIENT_EMAIL,
        },
        EMAILJS_PUBLIC_KEY
      );

      recordSubmit();
      setSubmitted(true);
    } catch (error) {
      console.error("❌ Email failed:", error);
      setSubmitError("Message could not be sent. Please try again later or email me directly.");
    } finally {
      setLoading(false);
    }
  };

  // Fully resets the form AND closes the popup — used by the header close
  // button and backdrop click.
  const closeAndReset = () => {
    setStep(1);
    setFormData({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setErrors({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setSubmitted(false);
    setLoading(false);
    setSubmitError("");
    onClose();
  };

  // Resets the form back to step 1 WITHOUT closing the popup — used by
  // "Send another message" on the success screen.
  const startNewMessage = () => {
    setStep(1);
    setFormData({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setErrors({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setSubmitted(false);
    setLoading(false);
    setSubmitError("");
  };

  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: E }}
          onClick={closeAndReset}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.92)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 14 }}
            transition={{ duration: 0.28, ease: E }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#14141A",
              width: "100%",
              maxWidth: "850px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "40px 32px",
              position: "relative",
              border: "2px solid rgba(206, 255, 26, 0.1)"
            }}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#CEFF1A",
                fontFamily: zalando.style.fontFamily,
                letterSpacing: "0.05em"
              }}>
                ...JCN
              </h2>
              <button
                onClick={closeAndReset}
                aria-label="Close contact form"
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#CEFF1A";
                  e.currentTarget.style.color = "#14141A";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#888";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "#CEFF1A";
                  e.currentTarget.style.color = "#14141A";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#888";
                }}
              >
                <MdClose size={18} />
              </button>
            </div>

            {!submitted && (
              <div style={{ height: "2px", background: "#333", marginBottom: "36px", position: "relative" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: E }}
                  style={{ height: "100%", background: "#CEFF1A" }}
                />
              </div>
            )}

            {!submitted && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "40px" }}>
                {Array.from({ length: 4 }).map((_, i) => {
                  const num = i + 1;
                  const isDone = num < step;
                  const isActive = num === step;
                  return (
                    <motion.div
                      key={num}
                      animate={{
                        background: isDone ? "#CEFF1A" : isActive ? "#14141A" : "transparent",
                        border: `2px solid ${isDone || isActive ? "#CEFF1A" : "#444"}`,
                        color: isDone ? "#14141A" : isActive ? "#CEFF1A" : "#888"
                      }}
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "12px",
                        fontFamily: '"Ubuntu Sans", monospace'
                      }}
                    >
                      {isDone ? <MdCheck size={14} /> : num.toString().padStart(2, "0")}
                    </motion.div>
                  );
                })}
              </div>
            )}

            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: E }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(220, 38, 38, 0.1)",
                    border: "1px solid rgba(220, 38, 38, 0.3)",
                    padding: "12px 14px",
                    marginBottom: "24px",
                    borderRadius: "4px"
                  }}
                >
                  <MdErrorOutline size={18} color="#ef4444" />
                  <p style={{ color: "#ef4444", fontSize: "13px", fontFamily: '"Ubuntu Sans", monospace', margin: 0 }}>
                    {submitError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key={step}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: E }}
                >
                  {step === 1 && (
                    <div>
                      <p style={{ color: "#CEFF1A", fontSize: "13px", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>01 — WHO ARE YOU</p>
                      <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", fontFamily: zalando.style.fontFamily, fontWeight: 800, textTransform: "uppercase" }}>
                        PLEASE STATE YOUR <span style={{ color: "#CEFF1A" }}>NAME.</span>
                      </h2>
                      <p style={{ color: "#aaa", maxWidth: "500px", marginBottom: "32px", fontFamily: '"Ubuntu Sans", monospace', fontSize: "15px" }}>
                        Hello there! Let’s start with a simple introduction — I’d love to know what I should call you.
                      </p>

                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", color: errors.fullName ? "#ef4444" : "#CEFF1A", fontSize: "13px", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="First & Last Name"
                          style={{
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            borderBottom: `1px solid ${errors.fullName ? "#ef4444" : "#CEFF1A"}`,
                            padding: "10px 0",
                            fontSize: "16px",
                            color: "#F5F6FC",
                            outline: "none",
                            fontFamily: '"Ubuntu Sans", monospace',
                            transition: "border-color 0.2s ease"
                          }}
                        />
                        <AnimatePresence>
                          {errors.fullName && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                color: "#ef4444",
                                fontSize: "12px",
                                marginTop: "6px",
                                marginBottom: "0",
                                fontFamily: '"Ubuntu Sans", monospace',
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                            >
                              <MdErrorOutline size={13} />
                              {errors.fullName}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <p style={{ color: "#CEFF1A", fontSize: "13px", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>02 — YOUR EMAIL</p>
                      <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", fontFamily: zalando.style.fontFamily, fontWeight: 800, textTransform: "uppercase" }}>
                        WHERE DO I <span style={{ color: "#CEFF1A" }}>FIND YOU?</span>
                      </h2>
                      <p style={{ color: "#aaa", maxWidth: "500px", marginBottom: "32px", fontFamily: '"Ubuntu Sans", monospace', fontSize: "15px" }}>
                        Great to meet you! Drop your email so I can reach out and get back to you as soon as possible.
                      </p>

                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", color: errors.email ? "#ef4444" : "#CEFF1A", fontSize: "13px", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          style={{
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            borderBottom: `1px solid ${errors.email ? "#ef4444" : "#CEFF1A"}`,
                            padding: "10px 0",
                            fontSize: "16px",
                            color: "#F5F6FC",
                            outline: "none",
                            fontFamily: '"Ubuntu Sans", monospace',
                            transition: "border-color 0.2s ease"
                          }}
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                color: "#ef4444",
                                fontSize: "12px",
                                marginTop: "6px",
                                marginBottom: "0",
                                fontFamily: '"Ubuntu Sans", monospace',
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                            >
                              <MdErrorOutline size={13} />
                              {errors.email}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <p style={{ color: "#CEFF1A", fontSize: "13px", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>03 — PROJECT TYPE</p>
                      <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", fontFamily: zalando.style.fontFamily, fontWeight: 800, textTransform: "uppercase" }}>
                        SO, {formData.fullName.trim() ? <span style={{ color: "#CEFF1A" }}>{formData.fullName}</span> : "HAVE YOU ALREADY"} HAVE YOU ALREADY <span style={{ color: "#CEFF1A" }}>DECIDED?</span>
                      </h2>
                      <p style={{ color: "#aaa", maxWidth: "500px", marginBottom: "32px", fontFamily: '"Ubuntu Sans", monospace', fontSize: "15px" }}>
                        Awesome! What kind of project are you looking to build? Pick the option that fits best.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "12px" }}>
                        {["WEB DESIGN", "WEB APP", "BRANDING", "UI/UX", "FREELANCE", "OTHER"].map(type => (
                          <motion.button
                            key={type}
                            onClick={() => handleSelect(type)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              padding: "12px",
                              border: `1px solid ${formData.projectType === type ? "#CEFF1A" : errors.projectType ? "#ef4444" : "#333"}`,
                              background: formData.projectType === type ? "#CEFF1A" : "transparent",
                              color: formData.projectType === type ? "#14141A" : "#F5F6FC",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: '"Ubuntu Sans", monospace',
                              fontSize: "14px",
                              textTransform: "uppercase",
                              transition: "border-color 0.2s ease"
                            }}
                          >
                            {type}
                          </motion.button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {errors.projectType && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              marginTop: "0",
                              marginBottom: "12px",
                              fontFamily: '"Ubuntu Sans", monospace',
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <MdErrorOutline size={13} />
                            {errors.projectType}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {formData.projectType === "OTHER" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ marginBottom: "12px", overflow: "hidden" }}
                          >
                            <label style={{ display: "block", color: errors.customProject ? "#ef4444" : "#CEFF1A", fontSize: "13px", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>
                              PLEASE DESCRIBE YOUR PROJECT TYPE
                            </label>
                            <input
                              type="text"
                              name="customProject"
                              value={formData.customProject}
                              onChange={handleChange}
                              placeholder="e.g. E-commerce, Mobile App, etc."
                              style={{
                                width: "100%",
                                background: "transparent",
                                border: "none",
                                borderBottom: `1px solid ${errors.customProject ? "#ef4444" : "#CEFF1A"}`,
                                padding: "10px 0",
                                fontSize: "16px",
                                color: "#F5F6FC",
                                outline: "none",
                                fontFamily: '"Ubuntu Sans", monospace',
                                transition: "border-color 0.2s ease"
                              }}
                            />
                            <AnimatePresence>
                              {errors.customProject && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  style={{
                                    color: "#ef4444",
                                    fontSize: "12px",
                                    marginTop: "6px",
                                    marginBottom: "0",
                                    fontFamily: '"Ubuntu Sans", monospace',
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                  }}
                                >
                                  <MdErrorOutline size={13} />
                                  {errors.customProject}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <p style={{ color: "#CEFF1A", fontSize: "13px", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>04 — YOUR VISION</p>
                      <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", fontFamily: zalando.style.fontFamily, fontWeight: 800, textTransform: "uppercase" }}>
                        GREAT! CAN YOU PLEASE TELL ME <span style={{ color: "#CEFF1A" }}>ABOUT IT?</span>
                      </h2>
                      <p style={{ color: "#aaa", maxWidth: "500px", marginBottom: "32px", fontFamily: '"Ubuntu Sans", monospace', fontSize: "15px" }}>
                        This is the fun part! Feel free to share all the details, ideas, and goals you have in mind — no need to hold back.
                      </p>

                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", color: errors.vision ? "#ef4444" : "#CEFF1A", fontSize: "13px", marginBottom: "10px", fontFamily: '"Ubuntu Sans", monospace' }}>
                          YOUR VISION
                        </label>
                        <textarea
                          name="vision"
                          value={formData.vision}
                          onChange={handleChange}
                          placeholder="Tell me about your project, timeline, goals, or anything else you’d like to share..."
                          maxLength={500}
                          rows={3}
                          style={{
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            borderBottom: `1px solid ${errors.vision ? "#ef4444" : "#CEFF1A"}`,
                            padding: "10px 0",
                            fontSize: "16px",
                            color: "#F5F6FC",
                            outline: "none",
                            resize: "none",
                            fontFamily: '"Ubuntu Sans", monospace',
                            transition: "border-color 0.2s ease"
                          }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                          <AnimatePresence>
                            {errors.vision && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                  color: "#ef4444",
                                  fontSize: "12px",
                                  margin: "0",
                                  fontFamily: '"Ubuntu Sans", monospace',
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}
                              >
                                <MdErrorOutline size={13} />
                                {errors.vision}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          <p style={{ textAlign: "right", color: "#666", fontSize: "11px", margin: "0", fontFamily: '"Ubuntu Sans", monospace' }}>
                            {formData.vision.length}/500
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      onClick={prevStep}
                      style={{
                        background: "transparent",
                        border: "1px solid #444",
                        color: "#aaa",
                        padding: "10px 20px",
                        cursor: "pointer",
                        display: step === 1 ? "none" : "block",
                        fontFamily: '"Ubuntu Sans", monospace',
                        textTransform: "uppercase",
                        fontSize: "14px"
                      }}
                      disabled={loading}
                    >
                      ← BACK
                    </button>

                    <motion.button
                      onClick={nextStep}
                      whileHover={!loading ? { scale: 1.03 } : {}}
                      whileTap={!loading ? { scale: 0.97 } : {}}
                      style={{
                        background: loading ? "#888" : "#CEFF1A",
                        border: "none",
                        color: "#14141A",
                        padding: "12px 28px",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        marginLeft: "auto",
                        fontFamily: '"Ubuntu Sans", monospace',
                        textTransform: "uppercase",
                        transition: "background 0.2s"
                      }}
                      disabled={loading}
                    >
                      {loading ? "SENDING..." : step === 4 ? "SEND IT →" : "CONTINUE"}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: E }}
                  style={{ textAlign: "center", padding: "32px 0" }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "#CEFF1A",
                      margin: "0 auto 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%"
                    }}
                  >
                    <MdCheck size={32} color="#14141A" />
                  </motion.div>

                  <p style={{ color: "#CEFF1A", fontSize: "13px", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: '"Ubuntu Sans", monospace', textTransform: "uppercase" }}>MESSAGE SENT SUCCESSFULLY</p>
                  <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", fontFamily: zalando.style.fontFamily, fontWeight: 800, textTransform: "uppercase" }}>
                    THANK YOU{formData.fullName.trim() ? <>, <span style={{ color: "#CEFF1A" }}>{formData.fullName}</span></> : ""} FOR REACHING OUT! <span style={{ color: "#CEFF1A" }}>I’LL GET BACK TO YOU SOON.</span>
                  </h2>
                  <p style={{ color: "#aaa", marginBottom: "28px", fontFamily: '"Ubuntu Sans", monospace', fontSize: "15px" }}>
                    I really appreciate you taking the time to share your ideas. Sit tight, and we’ll start turning your vision into reality very soon!
                  </p>

                  <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "32px" }}>
                    <a href="mailto:jhoncedrick.fuentes@gmail.com" style={{ color: "#F5F6FC", textDecoration: "none", fontFamily: '"Ubuntu Sans", monospace', textTransform: "uppercase", fontSize: "14px" }}>EMAIL</a>
                    <a href="https://github.com/uzercedrick/" target="_blank" rel="noopener noreferrer" style={{ color: "#F5F6FC", textDecoration: "none", fontFamily: '"Ubuntu Sans", monospace', textTransform: "uppercase", fontSize: "14px" }}>GITHUB</a>
                    <a href="https://linkedin.com/in/jcnungay" target="_blank" rel="noopener noreferrer" style={{ color: "#F5F6FC", textDecoration: "none", fontFamily: '"Ubuntu Sans", monospace', textTransform: "uppercase", fontSize: "14px" }}>LINKEDIN</a>
                  </div>

                  <motion.button
                    onClick={startNewMessage}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "#CEFF1A",
                      border: "none",
                      color: "#14141A",
                      padding: "12px 28px",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: '"Ubuntu Sans", monospace',
                      textTransform: "uppercase"
                    }}
                  >
                    SEND ANOTHER MESSAGE
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}