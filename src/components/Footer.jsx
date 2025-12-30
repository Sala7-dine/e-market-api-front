// eslint-disable-next-line no-unused-vars
import React, { memo } from "react";

const Footer = () => (
  <footer className="tracking-wide bg-[#222] pt-12 pb-6 px-10">
    <div className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-medium text-base mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Our Story
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Newsroom
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Press Kit
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium text-base mb-6">Services</h4>
          <ul className="space-y-4">
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Web Development
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Testing Automation
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                AWS Development Services
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Mobile App Development
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                UI/UX Design
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium text-base mb-6">Platforms</h4>
          <ul className="space-y-4">
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Hubspot
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Marketo Integration Services
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Marketing Glossary
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                UIPath
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Salesforce
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Zapier Integration
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium text-base mb-6">Company</h4>
          <ul className="space-y-4">
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Accessibility
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Learn more
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="hover:text-white text-slate-400 text-sm font-normal transition-all"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t text-left border-gray-700 pt-6 mt-8">
        <p className="text-slate-400 text-sm">© Zendora. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default memo(Footer);
