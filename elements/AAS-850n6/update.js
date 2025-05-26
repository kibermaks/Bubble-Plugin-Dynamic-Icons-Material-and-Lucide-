function(instance, properties, context) {

    const uniqueNumber = instance.data.uniqueNumber;
    const wrapper = instance.data.wrapperElement;

    if (!wrapper) {
        return;
    }

    const transformIconName = (name) => {
        if (typeof name !== 'string' || name.trim() === '') return '';
        return name.trim().toLowerCase().replace(/\s+/g, '_');
    };

    const getPositionStyles = (position) => {
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

    const positionStyles = getPositionStyles(properties.icon_position);
    const pointerStyle = !properties.is_not_clickable ? 'cursor: pointer;' : 'cursor: default;';
    instance.data._is_not_clickable_cached = properties.is_not_clickable;

    wrapper.title = properties.tooltip ?? "";
    wrapper.style.cssText = `
        display: flex;
        ${positionStyles}
        height: 100%;
        width: 100%;
        ${pointerStyle}
    `;

    const nameToRender = transformIconName(properties.icon_name);
    const noIconWanted = !nameToRender; // If properties.icon_name is empty or whitespace, no icon.

    let materialSymbolClass = "material-symbols-rounded"; // Default
    if (properties.icon_style === "Outlined") materialSymbolClass = "material-symbols-outlined";
    else if (properties.icon_style === "Sharp") materialSymbolClass = "material-symbols-sharp";
    
    const baseIconInstanceClass = `dynamic-icon-pro-material-${uniqueNumber}`;
    const fullIconClasses = `${baseIconInstanceClass} ${materialSymbolClass}`;

    const fillValue = properties.is_icon_filled ? 1 : 0;
    const weightValue = properties.icon_weight || 400;
    const iconSize = properties.icon_width || 24;

    let gradeValue = 0; // Default
    switch (properties.icon_grade) {
        case 'Low':
            gradeValue = -25;
            break;
        case 'High Emphasis':
            gradeValue = 200;
            break;
        // 'Default' or any other value will use the initialized gradeValue = 0
    }

    const iconElementStyles = `
        font-variation-settings: 'FILL' ${fillValue}, 'wght' ${weightValue}, 'opsz' ${iconSize}, 'GRAD' ${gradeValue};
        font-size: ${iconSize}px;
        color: ${properties.icon_color || 'currentColor'};
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none;    /* Firefox */
        -ms-user-select: none;     /* Internet Explorer/Edge */
        user-select: none;         /* Standard */
    `;

    let currentIconInDom = wrapper.querySelector(`.${baseIconInstanceClass}`);

    if (noIconWanted) {
        if (currentIconInDom) wrapper.removeChild(currentIconInDom);
        instance.data.iconElement = null;
    } else {
        const currentIconTextInDom = currentIconInDom ? currentIconInDom.innerText : null;
        const currentClassesInDom = currentIconInDom ? currentIconInDom.className : "";

        if (!currentIconInDom || 
            currentIconTextInDom !== nameToRender || 
            !currentClassesInDom.includes(materialSymbolClass)) {
            
            if (currentIconInDom) wrapper.removeChild(currentIconInDom);

            const newIconElement = document.createElement('span');
            newIconElement.className = fullIconClasses;
            newIconElement.innerText = nameToRender;
            newIconElement.style.cssText = iconElementStyles;

            wrapper.appendChild(newIconElement);
            instance.data.iconElement = newIconElement;
        } else {
            currentIconInDom.style.cssText = iconElementStyles;
            instance.data.iconElement = currentIconInDom;
        }
    }
}