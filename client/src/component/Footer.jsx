import React from "react";
import { assets, footerLinks } from "../assets/assets";
const Footer = () => {

    return (
        <div className="bg-primary/10 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="dummyLogoColored" />
                    <p className="mt-6">From our shelves to your home — bringing fresh groceries, trusted products, and a smile with every purchase. We are proud to serve our community.
                    </p>
                    <p className="mt-6">Inspired by Aman Kirana Store </p>
                    <p className="mt-1">Since 2001 </p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright 2026 © <a href="#">Daily Basket </a> All Right Reserved.
            </p>
        </div>
    );
};
export default Footer;