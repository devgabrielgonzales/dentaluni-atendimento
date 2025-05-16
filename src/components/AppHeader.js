import React, { useState, useEffect } from "react";
import { FaUserCircle, FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";

const formatUserNameDisplay = (fullName) => {
  if (!fullName || typeof fullName !== "string") return "Usuário";
  let mainNamePart = fullName;
  const separatorIndex = fullName.indexOf(" - ");
  if (separatorIndex !== -1) {
    mainNamePart = fullName.substring(0, separatorIndex);
  }
  const nameParts = mainNamePart
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (nameParts.length === 0) return "Usuário";
  const firstName =
    nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
  if (nameParts.length > 1) {
    const lastName =
      nameParts[nameParts.length - 1].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].slice(1).toLowerCase();
    return `${firstName} ${lastName}`;
  }
  return firstName;
};

const formatCNPJ = (digitsOnly) => {
  if (!digitsOnly || typeof digitsOnly !== "string") return "N/A";
  const cleaned = digitsOnly.replace(/\D/g, "");
  if (cleaned.length !== 14) return digitsOnly;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(
    5,
    8
  )}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
};

const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  const articles = ["de", "do", "da", "dos", "das", "e", "a", "o", "um", "uma"];
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (word.length > 1 && word === word.toUpperCase()) return word;
      if (index > 0 && articles.includes(word.toLowerCase()))
        return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const AppHeader = ({
  companyId: companyIdProp,
  companyName: companyNameProp,
  companyCnpj: companyCnpjProp,
  isLoadingCompanyInfo,
  pageTitle,
}) => {
  const [userName, setUserName] = useState("Usuário");
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);

  const [effectiveCompanyId, setEffectiveCompanyId] = useState(companyIdProp);
  const [effectiveCompanyName, setEffectiveCompanyName] =
    useState(companyNameProp);
  const [effectiveCompanyCnpj, setEffectiveCompanyCnpj] =
    useState(companyCnpjProp);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(formatUserNameDisplay(storedUserName));
    } else {
      setUserName(formatUserNameDisplay("Gabriel Gonzales"));
    }
    const storedUserImg = localStorage.getItem("userImg");
    if (storedUserImg && storedUserImg.trim() !== "") {
      setUserAvatarUrl(storedUserImg);
    } else {
      setUserAvatarUrl(null);
    }

    if (companyIdProp !== undefined) setEffectiveCompanyId(companyIdProp);
    else setEffectiveCompanyId(localStorage.getItem("selectedCompanyId"));

    if (companyNameProp !== undefined)
      setEffectiveCompanyName(toTitleCase(companyNameProp));
    else
      setEffectiveCompanyName(
        toTitleCase(localStorage.getItem("selectedCompanyName"))
      );

    if (companyCnpjProp !== undefined) setEffectiveCompanyCnpj(companyCnpjProp);
    else setEffectiveCompanyCnpj(localStorage.getItem("selectedCompanyCnpj"));
  }, [companyIdProp, companyNameProp, companyCnpjProp]);

  const headerAnimationProps = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const companyCardAnimationProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.4, ease: "easeOut" },
  };

  const displayCompanyIdText = isLoadingCompanyInfo
    ? "..."
    : effectiveCompanyId || "N/A";
  const displayCompanyCnpjText = isLoadingCompanyInfo
    ? "..."
    : formatCNPJ(effectiveCompanyCnpj || "");
  const displayCompanyNameText = isLoadingCompanyInfo
    ? "Carregando..."
    : effectiveCompanyName || pageTitle || "Detalhes";

  return (
    <header className="details-header-curved container">
      <div className="header-content-container">
        <div className="user-info-container container">
          {userAvatarUrl ? (
            <div className="circle">
              <img
                src={userAvatarUrl}
                alt="Avatar do Usuário"
                className="circle-img"
              />
            </div>
          ) : (
            <FaUserCircle className="user-avatar-icon-v2" />
          )}
          <div className="user-text-info">
            <motion.p
              className="user-welcome-text-v2"
              {...headerAnimationProps}
              transition={{ ...headerAnimationProps.transition, delay: 0.2 }}
            >
              Olá, Bem-vindo! 👋
            </motion.p>
            <motion.h1
              className="user-name-text-v2"
              {...headerAnimationProps}
              transition={{ ...headerAnimationProps.transition, delay: 0.3 }}
            >
              {userName}
            </motion.h1>
          </div>
        </div>
        <motion.div
          className="company-display-card container"
          {...companyCardAnimationProps}
        >
          <div className="company-text-info">
            <span className="company-label">
              {`Código: ${displayCompanyIdText} | CNPJ: ${displayCompanyCnpjText}`}
            </span>
            <h2 className="company-name-text">{displayCompanyNameText}</h2>
          </div>
          {effectiveCompanyId && !isLoadingCompanyInfo && (
            <FaBuilding className="icon-building" />
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default AppHeader;
