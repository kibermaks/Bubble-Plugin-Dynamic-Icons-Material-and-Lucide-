function(instance, properties, context) {

    const uniqueNumber = instance.data.uniqueNumber;
    const wrapper = instance.data.wrapperElement;

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

    // --- Icon Element Management ---
    const iconNameFromProperties = properties.icon_name;
    const noIconWanted = !iconNameFromProperties || iconNameFromProperties.toLowerCase() === 'null';
    
    // Define styles for the icon element (used in multiple places)
    const iconStyles = `
        stroke-width: ${properties.icon_stroke};
        width: ${properties.icon_width}px;
        height: ${properties.icon_width}px;
        stroke: ${properties.icon_color || 'currentColor'} !important;
        ${properties.is_icon_filled ? `fill: ${properties.icon_filled_color || properties.icon_color || 'currentColor'} !important;` : 'fill: none;'}
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        shape-rendering: geometricPrecision;
    `;

    let lucideNeedsProcessing = false;
    const uniqueIconClass = `dynamic-icon-pro-lucide-${uniqueNumber}`;

    // Attempt to find an existing icon element managed by this instance within the wrapper
    let currentIconInDom = wrapper.querySelector(`.${uniqueIconClass}`);

    if (noIconWanted) {
        // If no icon is desired, remove the current one if it exists
        if (currentIconInDom) {
            wrapper.removeChild(currentIconInDom);
        }
        instance.data.iconElement = null; // Clear the stored reference
    } else {
        // An icon is wanted
        const currentIconNameInDom = currentIconInDom ? currentIconInDom.getAttribute('data-lucide') : null;

        if (currentIconInDom && currentIconNameInDom === iconNameFromProperties) {
            // Case 1: Icon exists in DOM, has the correct name. Just update its styles.
            currentIconInDom.style.cssText = iconStyles;
            instance.data.iconElement = currentIconInDom; // Ensure instance.data reference is correct
            if (!currentIconInDom.querySelector('svg')) { // If Lucide SVG is missing for some reason
                lucideNeedsProcessing = true;
            }
        } else {
            // Case 2: Icon needs to be created or replaced.
            // (Either no icon in DOM, or existing one has wrong name)

            // If an icon from this instance exists in the DOM, remove it first.
            if (currentIconInDom) {
                wrapper.removeChild(currentIconInDom);
            }

            // Create the new icon element
            const newIconElement = document.createElement('i');
            newIconElement.className = uniqueIconClass; // Assign the unique class
            newIconElement.setAttribute('data-lucide', iconNameFromProperties);
            newIconElement.style.cssText = iconStyles;

            wrapper.appendChild(newIconElement);
            instance.data.iconElement = newIconElement; // Store reference to the new icon
            lucideNeedsProcessing = true;
        }
    }
    
    

    // Call lucide.createIcons()
    if (lucideNeedsProcessing && instance.data.iconElement) {
        lucide.createIcons();
    } else if (!noIconWanted && instance.data.iconElement && !instance.data.iconElement.querySelector('svg')) {
        // Fallback: if icon is supposed to be there but SVG is missing (e.g. after style update)
        lucide.createIcons();
    }
}