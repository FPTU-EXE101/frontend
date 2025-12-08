import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./logo";

const footerSections = [
  {
    title: "SubTitle 1",
    links: [
      { name: "SubChoice 1", href: "/" },
      { name: "SubChoice 2", href: "/a" },
      { name: "SubChoice 3", href: "/b" },
      { name: "SubChoice 4", href: "/c" },
    ],
  },
  {
    title: "SubTitle 2",
    links: [
      { name: "SubChoice 5", href: "/d" },
      { name: "SubChoice 6", href: "/e" },
      { name: "SubChoice 7", href: "/f" },
      { name: "Trợ giúp", href: "/" },
    ],
  },
];

const contactInfo = [
  { icon: Phone, text: "(84) 123-456-789" },
  { icon: Mail, text: "exampleEmail@gmail.com" },
  { icon: MapPin, text: "Thành phố Hồ Chí Minh, Việt Nam" },
];

function Footer() {
  return (
    <footer className="bg-black text-white py-8 mt-auto border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin liên hệ</h4>
            <div className="space-y-2 text-muted-foreground">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <p>{contact.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-4 text-center text-muted-foreground">
          <p>&copy; 2026 Lorem Ipsum. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
