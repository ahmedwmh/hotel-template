import { getSiteSetting } from "@/lib/actions/site-content";
import { getMessages, type Locale } from "@/lib/i18n";
import { PublicLayout } from "@/Components/public/PublicLayout";
import { ContactForm, type ContactLabels } from "@/Components/forms/ContactForm";
import { hotelImages } from "@/lib/hotel-images";
import Image from "next/image";
import { MdEmail, MdOutlineShareLocation } from "react-icons/md";
import { IoIosCall } from "react-icons/io";

const DEFAULT_TITLE_EN = "Contact With Us";
const DEFAULT_TITLE_AR = "تواصل معنا";
const DEFAULT_SUBTITLE_EN = "Contact Us";
const DEFAULT_SUBTITLE_AR = "اتصل بنا";
const DEFAULT_DESCRIPTION_EN =
  "Get in touch for reservations, inquiries or feedback. We are here to help.";
const DEFAULT_DESCRIPTION_AR =
  "تواصل معنا للحجوزات أو الاستفسارات. نحن هنا لمساعدتك.";
const DEFAULT_FORM_HEADING_EN = "Get in Touch";
const DEFAULT_FORM_HEADING_AR = "تواصل معنا";
const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.0!2d44.33!3d32.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzQ4LjAiTiA0NMKwMTknNDguMCJF!5e0!3m2!1sen!2s!4v1";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [
    titleRes,
    subtitleRes,
    descriptionRes,
    emailRes,
    phoneRes,
    phone2Res,
    addressRes,
    formHeadingRes,
    mapRes,
  ] = await Promise.all([
    getSiteSetting("contact_title", locale),
    getSiteSetting("contact_subtitle", locale),
    getSiteSetting("contact_description", locale),
    getSiteSetting("contact_email", locale),
    getSiteSetting("contact_phone", locale),
    getSiteSetting("contact_phone_2", locale),
    getSiteSetting("contact_address", locale),
    getSiteSetting("contact_form_heading", locale),
    getSiteSetting("contact_map_embed", null),
  ]);

  const title =
    (titleRes.success ? titleRes.value : null)?.trim() ||
    (isAr ? DEFAULT_TITLE_AR : DEFAULT_TITLE_EN);
  const subtitle =
    (subtitleRes.success ? subtitleRes.value : null)?.trim() ||
    (isAr ? DEFAULT_SUBTITLE_AR : DEFAULT_SUBTITLE_EN);
  const description =
    (descriptionRes.success ? descriptionRes.value : null)?.trim() ||
    (isAr ? DEFAULT_DESCRIPTION_AR : DEFAULT_DESCRIPTION_EN);
  const email = (emailRes.success ? emailRes.value : null)?.trim() || "";
  const phone = (phoneRes.success ? phoneRes.value : null)?.trim() || "";
  const phone2 = (phone2Res.success ? phone2Res.value : null)?.trim() || "";
  const address = (addressRes.success ? addressRes.value : null)?.trim() || "";
  const formHeading =
    (formHeadingRes.success ? formHeadingRes.value : null)?.trim() ||
    (isAr ? DEFAULT_FORM_HEADING_AR : DEFAULT_FORM_HEADING_EN);
  const mapEmbed = (mapRes.success ? mapRes.value : null)?.trim() || DEFAULT_MAP_EMBED;

  const t = getMessages(locale).contact as ContactLabels;

  return (
    <PublicLayout locale={locale}>
      {/* Breadcrumb / Header */}
      <section
        className="bg-no-repeat bg-cover min-h-[280px] lg:min-h-[320px] bg-center grid items-center justify-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,0.5), rgba(30,30,30,0.5)), url(${hotelImages.breadcrumb})`,
          backgroundSize: "cover",
        }}
      >
        <div className="text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <hr className="w-[100px] h-[1px] bg-[#C9A24D]" />
            <Image
              src="/images/logo/logo-s.svg"
              alt=""
              width={50}
              height={50}
            />
            <hr className="w-[100px] h-[1px] bg-[#C9A24D]" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-tight text-white font-semibold font-Garamond uppercase">
            {title}
          </h1>
          <p className="mt-3 text-base lg:text-lg text-[#acacac] font-Lora max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Contact content + form */}
      <section className="py-16 2xl:py-24 bg-[#000]">
        <div
          className="Container px-4 md:px-6 lg:px-8"
          style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: contact info */}
              <div className="p-6 sm:p-8 lg:p-10 2xl:p-14 flex-1">
                <p className="font-Garamond text-base leading-[26px] text-[#C9A24D] font-medium">
                  {subtitle}
                </p>
                <h2 className="font-Garamond text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-white font-semibold my-3 md:my-5 uppercase">
                  {title}
                </h2>
                <p className="font-Lora text-sm sm:text-base leading-[26px] text-zinc-400 font-normal whitespace-pre-line">
                  {description}
                </p>

                {(phone || phone2) && (
                  <>
                    <div className="flex items-center my-6 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#1e1e1e] group-hover:bg-[#C9A24D] grid items-center justify-center rounded-full transition-all duration-300 shrink-0">
                        <IoIosCall
                          size={22}
                          className="text-[#C9A24D] group-hover:text-white"
                        />
                      </div>
                      <div className={isAr ? "mr-3 md:mr-4" : "ml-3 md:ml-4"}>
                        <p className="font-Lora text-sm leading-[26px] text-zinc-500 font-normal">
                          {t.callUsNow}
                        </p>
                        <div className="flex flex-col gap-1">
                          {phone ? (
                            <a
                              href={`tel:${phone.replace(/\s/g, "")}`}
                              className="font-Garamond text-lg sm:text-xl text-white font-medium hover:text-[#C9A24D]"
                            >
                              {phone}
                            </a>
                          ) : null}
                          {phone2 ? (
                            <a
                              href={`tel:${phone2.replace(/\s/g, "")}`}
                              className="font-Garamond text-lg sm:text-xl text-white font-medium hover:text-[#C9A24D]"
                            >
                              {phone2}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <hr className="border-zinc-600 my-4" />
                  </>
                )}

                {email && (
                  <>
                    <div className="flex items-center my-6 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#1e1e1e] group-hover:bg-[#C9A24D] grid items-center justify-center rounded-full transition-all duration-300 shrink-0">
                        <MdEmail
                          size={22}
                          className="text-[#C9A24D] group-hover:text-white"
                        />
                      </div>
                      <div className={isAr ? "mr-3 md:mr-4" : "ml-3 md:ml-4"}>
                        <p className="font-Lora text-sm leading-[26px] text-zinc-500 font-normal">
                          {t.sendEmail}
                        </p>
                        <a
                          href={`mailto:${email}`}
                          className="font-Garamond text-lg sm:text-xl text-white font-medium hover:text-[#C9A24D]"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                    <hr className="border-zinc-600 my-4" />
                  </>
                )}

                {address && (
                  <div className="flex items-center my-6 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#1e1e1e] group-hover:bg-[#C9A24D] grid items-center justify-center rounded-full transition-all duration-300 shrink-0">
                      <MdOutlineShareLocation
                        size={22}
                        className="text-[#C9A24D] group-hover:text-white"
                      />
                    </div>
                    <div className={isAr ? "mr-3 md:mr-4" : "ml-3 md:ml-4"}>
                      <p className="font-Lora text-sm leading-[26px] text-zinc-500 font-normal">
                        {t.ourLocation}
                      </p>
                      <p className="font-Garamond text-lg sm:text-xl text-white font-medium whitespace-pre-line">
                        {address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: form */}
              <div className="flex-1">
                <ContactForm labels={t} formHeading={formHeading} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {mapEmbed && (
        <section className="w-full">
          <iframe
            src={mapEmbed}
            height={450}
            allowFullScreen
            loading="lazy"
            className="w-full border-0"
            title="Map"
          />
        </section>
      )}

    </PublicLayout>
  );
}
