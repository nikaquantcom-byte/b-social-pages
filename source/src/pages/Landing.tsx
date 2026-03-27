import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/test");
  }, []);

  return null;
}
