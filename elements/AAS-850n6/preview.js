function(instance, properties) {
    if (typeof instance.data === 'undefined') {
        instance.data = {};
    }
    // Use a more specific prefix for preview data to avoid potential clashes
    const uniqueNumber = instance.data.ms_preview_uniqueId || crypto.randomUUID();
    instance.data.ms_preview_uniqueId = uniqueNumber;

    const root = instance.canvas.get(0);

    instance.canvas.css({
        height: "100%",
        width: "100%",
    });
    
    instance.canvas.closest("html").css({
    	height: "100%",
    	width: "100%",
    })
    
    instance.canvas.closest("body").css({
    	overflow: "hidden",
        height: "100%",
    })

    let fontStyleNeeded = "Rounded"; // Default
    if (properties.icon_style === "Outlined") fontStyleNeeded = "Outlined";
    else if (properties.icon_style === "Sharp") fontStyleNeeded = "Sharp";

    const fontStylesheetId = `material-symbols-font-${fontStyleNeeded.toLowerCase()}`;
    const fontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+${fontStyleNeeded}:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..200`;

    if (!document.getElementById(fontStylesheetId)) {
        const link = document.createElement('link');
        link.id = fontStylesheetId;
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // --- Helper Functions ---
    const transformIconNameForMaterial = (name) => {
        if (typeof name !== 'string' || name.trim() === '') return '';
        return name.trim().toLowerCase().replace(/\s+/g, '_');
    };

    const isLikelyBubbleDynamicValue = (value) => {
        if (typeof value !== 'string' || value.trim() === '') return false;
        const words = value.trim().split(/\s+/);
        if (value.includes("'s")) return true;
        for (const word of words) {
            if (word.length > 1 && /^[a-z]/.test(word) && !/^[a-z]+$/.test(word)) return true;
            if (word.length > 1 && /[A-Z]/.test(word) && /[a-z]/.test(word) && /^[a-z]/.test(word.charAt(0))) return true;
        }
        return false;
    };
    
    const getPositionStyles = (position) => { /* ... (same as before) ... */ 
        switch(position) {
            case 'Top-left': return 'justify-content: flex-start; align-items: flex-start;';
            case 'Top-center': return 'justify-content: center; align-items: flex-start;';
            case 'Top-right': return 'justify-content: flex-end; align-items: flex-start;';
            case 'Middle-left': return 'justify-content: flex-start; align-items: center;';
            case 'Middle-center': return 'justify-content: center; align-items: center;';
            case 'Middle-right': return 'justify-content: flex-end; align-items: center;';
            case 'Bottom-left': return 'justify-content: flex-start; align-items: flex-end;';
            case 'Bottom-center': return 'justify-content: center; align-items: flex-end;';
            case 'Bottom-right': return 'justify-content: flex-end; align-items: flex-end;';
            default: return 'justify-content: center; align-items: center;';
        }
    };

    function isValidColorFormat(colorStr) { /* ... (same as before) ... */ 
        if (typeof colorStr !== 'string') return false;
        const colorRegex = /^(#(?:[0-9a-fA-F]{3,4}){1,2}|rgb\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*\)|rgba\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*(?:0|1|0?\.\d+)\s*\))$/i;
        return colorRegex.test(colorStr.trim());
    }

    // --- Determine Icon Name to Render ---
    let iconNameToRender;
    const rawIconNameProp = properties.icon_name;

    if (isLikelyBubbleDynamicValue(rawIconNameProp)) {
        iconNameToRender = transformIconNameForMaterial(properties.fallback_icon_name) || "help_outline";
    } else {
        iconNameToRender = transformIconNameForMaterial(rawIconNameProp);
    }
    
    const noIconWanted = !iconNameToRender;

    // --- Get Style Properties ---
    const iconWidth = (typeof properties.icon_width === 'number' && properties.icon_width > 0) ? properties.icon_width : 24;
    const iconColor = isValidColorFormat(properties.icon_color) ? properties.icon_color : '#333333';
    const isIconFilled = (typeof properties.is_icon_filled === 'boolean') ? properties.is_icon_filled : false;
    const iconWeight = (typeof properties.icon_weight === 'number') ? properties.icon_weight : 400;

    let gradeValue = 0;
    switch (properties.icon_grade) {
        case 'Low': gradeValue = -25; break;
        case 'High Emphasis': gradeValue = 200; break;
    }

    let materialSymbolClass = "material-symbols-rounded";
    let fontFamilyName = "Material Symbols Rounded";
    if (properties.icon_style === "Outlined") {
        materialSymbolClass = "material-symbols-outlined";
        fontFamilyName = "Material Symbols Outlined";
    } else if (properties.icon_style === "Sharp") {
        materialSymbolClass = "material-symbols-sharp";
        fontFamilyName = "Material Symbols Sharp";
    }

    const positionStyles = getPositionStyles(properties.icon_position);

    // --- DOM Structure & Styling for Preview ---
    const wrapperClassName = `ms-icon-preview-wrapper-${uniqueNumber}`;
    const styleTagId = `ms-icon-preview-style-${uniqueNumber}`;
    const iconElementClassName = `ms-icon-preview-element-${uniqueNumber}`; // Unique class for the icon itself

    let wrapper = root.querySelector(`.${wrapperClassName}`);
    let styleTag = root.querySelector(`#${styleTagId}`);

    if (!wrapper) {
        root.innerHTML = ''; 

        styleTag = document.createElement('style');
        styleTag.id = styleTagId;
        root.appendChild(styleTag);

        wrapper = document.createElement('div');
        wrapper.className = wrapperClassName;
        root.appendChild(wrapper);
    }
    
    styleTag.innerHTML = `
        .${iconElementClassName} {
            font-variation-settings: 'FILL' ${isIconFilled ? 1 : 0}, 'wght' ${iconWeight}, 'opsz' ${iconWidth}, 'GRAD' ${gradeValue} !important;
            font-size: ${iconWidth}px !important;
            color: ${iconColor} !important;
            /* The font-family will be inherited from the wrapper or set directly if needed */
            font-family: '${fontFamilyName}', sans-serif !important; /* Explicitly set font family on the icon element */
            line-height: 1 !important;
            letter-spacing: normal !important;
            text-transform: none !important;
            display: inline-block !important;
            white-space: nowrap !important;
            word-wrap: normal !important;
            direction: ltr !important;
            -webkit-font-smoothing: antialiased !important;
            text-rendering: optimizeLegibility !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-feature-settings: 'liga' !important;
        }
    `;
    
    wrapper.style.cssText = `
        display: flex !important;
        ${positionStyles}
        height: 100%;
        width: 100%;
    `;

    // --- Icon Element ---
    let iconElement = wrapper.querySelector(`.${iconElementClassName}`);

    if (noIconWanted) {
        if (iconElement) wrapper.removeChild(iconElement);
    } else {
        if (!iconElement) {
            iconElement = document.createElement('span');

            iconElement.className = `${materialSymbolClass} ${iconElementClassName}`; 
            wrapper.appendChild(iconElement);
        } else {

            iconElement.className = `${materialSymbolClass} ${iconElementClassName}`;
        }
        iconElement.innerText = iconNameToRender;
    }
}