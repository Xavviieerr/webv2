type NavLinksProps = {
  language: string;
};

export const getNavLinks = ({language}: NavLinksProps) => [
  {label: "home", href: language === "en" ? "/home" : "/uwevwi"},
  {label: "about", href: language === "en" ? "/about" : "/kpahe"},
  {label: "Guọnọpedia", href: "/guonopedia"},
  {label: "donate", href: language === "en" ? "/donate" : "/siobonu"},
];
