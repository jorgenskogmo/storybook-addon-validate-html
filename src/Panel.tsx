import React, {useState, useEffect} from "react";
import { useAddonState, useChannel } from "@storybook/api";
import { AddonPanel } from "@storybook/components";
import { ADDON_ID, EVENT_CODE_RECEIVED } from "./constants";
import { ValidationPanel } from "./components/ValidationPanel";

interface PanelProps {
  active: boolean;
}

export const Panel: React.FC<PanelProps> = (props) => {
  const {active} = props;
  const [html, setHtml] = useAddonState(ADDON_ID, '');
  
  useChannel({
    [EVENT_CODE_RECEIVED]: ({ html, ...rest }) => {
      // console.log('Panel EVENT_CODE_RECEIVED', active, html)
      if( active ){
        // setHtml(html);
        // setHtml("<div>lorem ipsum</span>");
        setHtml(test);
      }
    },
  });

  return (
    <AddonPanel {...props}>
      <ValidationPanel html={html} active={active} />
    </AddonPanel>
  );
};

const test = `<div dir="ltr" class="css-1ub1aw">
<div role="group" class="chakra-form-control css-0">
  <label
    id="field-3-label"
    for="field-3"
    class="chakra-form__label css-s4r4ac"
    >Many options</label
  >
  <div class="chakra-input__group css-4302v8">
    <input
      tabindex="0"
      class="
        chakra-input
        chakra-menu__menu-button
        klik-ui-dropdown__button
        klik-dropdown
        css-yedl0j
      "
      aria-expanded="false"
      aria-haspopup="menu"
      aria-controls="menu-list-2"
      aria-label="Choose option..."
      role="button"
      type="button"
      id="field-3"
      value="Choose option..."
    />
    <div class="chakra-input__right-element css-1m4kiq2">
      <svg
        viewBox="0 0 24 24"
        focusable="false"
        class="chakra-icon css-1j2uq9p"
        data-icon-fixed="true"
      >
        <g fill="currentColor">
          <path
            d="M2.506 7.888a1.5 1.5 0 00-2.012 2.224l10.5 9.5a1.5 1.5 0 002.012 0l10.5-9.5a1.5 1.5 0 10-2.012-2.224L12 16.478l-9.494-8.59z"
          ></path>
        </g>
      </svg>
    </div>
  </div>
</div>
</div>`