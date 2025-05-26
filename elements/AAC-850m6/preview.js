function(instance, properties) {
    
    if (typeof instance.data === 'undefined') {
        instance.data = {};
    }

    const uniqueNumber = instance.data.previewUniqueNumber || crypto.randomUUID();
    instance.data.previewUniqueNumber = uniqueNumber;
    instance.canvas.css({
    	height: "100%",
    	width: "100%",
    })
    
    instance.canvas.closest("html").css({
    	height: "100%",
    	width: "100%",
    })
    
    instance.canvas.closest("body").css({
    	overflow: "hidden",
        height: "100%",
    })
    let root = instance.canvas.get(0);

    // Helper function to validate icon name format based on provided conventions
    // This primarily checks for lower kebab-case and permissible use of numerals.
    // Semantic conventions (e.g., naming for depiction, international English) are not programmatically validated here.
    function isValidIconNameFormat(iconName) {
        if (typeof iconName !== 'string' || iconName.trim() === '') {
            return false;
        }
        // Regex: starts with one or more lowercase letters,
        // followed by zero or more groups of:
        //   a hyphen, then one or more lowercase letters or digits.
        // Examples: 'search', 'arrow-up', 'arrow-down-0-to-1'
        // Invalid: 'Search', 'arrow_up', '-private', 'icon-', '123-icon', 'name--double-hyphen'
        const KEBAB_CASE_REGEX = /^[a-z]+(?:-[a-z0-9]+)*$/;
        return KEBAB_CASE_REGEX.test(iconName);
    }

    function isValidColorFormat(colorStr) {
        if (typeof colorStr !== 'string') return false;
        // Regex to match hex, rgb, rgba
        // Hex: # followed by 3, 4, 6, or 8 hex characters (e.g., #RGB, #RGBA, #RRGGBB, #RRGGBBAA)
        // RGB: rgb(r,g,b) where r,g,b are numbers 0-255 or percentages 0-100%
        // RGBA: rgba(r,g,b,a) where r,g,b are as above, and a is 0-1 (e.g., 0.5, .5)
        const colorRegex = /^(#(?:[0-9a-fA-F]{3,4}){1,2}|rgb\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*\)|rgba\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*(?:0|1|0?\.\d+)\s*\))$/i;
        return colorRegex.test(colorStr.trim());
    }

    // Validate and set default style properties
    const iconStroke = (typeof properties.icon_stroke === 'number') ? properties.icon_stroke : 2;
    const iconWidth = (typeof properties.icon_width === 'number') ? properties.icon_width : 24;
    const iconColor = isValidColorFormat(properties.icon_color) ? properties.icon_color : '#000000';
    const isIconFilled = (typeof properties.is_icon_filled === 'boolean') ? properties.is_icon_filled : false;
    const iconFilledColor = isValidColorFormat(properties.icon_filled_color) ? properties.icon_filled_color : '#000000';

    let imgEl = document.createElement('img');
    imgEl.className = `svg icon-lucide-pro-${uniqueNumber}`;
    
    // Determine the actual fallback icon name
    let actualFallbackIconName = 'image'; // Default fallback
    if (typeof properties.fallback_icon_name === 'string' && properties.fallback_icon_name.trim() !== '') {
        if (isValidIconNameFormat(properties.fallback_icon_name)) {
            actualFallbackIconName = properties.fallback_icon_name;
        } else {
        }
    }

    const fallbackIconSrc = `https://unpkg.com/lucide-static@latest/icons/${actualFallbackIconName}.svg`;

    // Function to map icon positions to flexbox alignment properties
    const getPositionStyles = (position) => {
        switch(position) {
            case 'Top-left':
                return 'justify-content: flex-start; align-items: flex-start;';
            case 'Top-center':
                return 'justify-content: center; align-items: flex-start;';
            case 'Top-right':
                return 'justify-content: flex-end; align-items: flex-start;';
            case 'Middle-left':
                return 'justify-content: flex-start; align-items: center;';
            case 'Middle-center':
                return 'justify-content: center; align-items: center;';
            case 'Middle-right':
                return 'justify-content: flex-end; align-items: center;';
            case 'Bottom-left':
                return 'justify-content: flex-start; align-items: flex-end;';
            case 'Bottom-center':
                return 'justify-content: center; align-items: flex-end;';
            case 'Bottom-right':
                return 'justify-content: flex-end; align-items: flex-end;';
            default:
                return 'justify-content: center; align-items: center;'; // Default to center if position is not recognized
        }
    };

    // Get position styles
    const positionStyles = getPositionStyles(properties.icon_position);
    // Set up the container with styles
    root.innerHTML = `
        <style>
            .icon-lucide-pro-${uniqueNumber} {
                stroke-width: ${iconStroke};
                width: ${iconWidth}px;
                height: ${iconWidth}px;
                stroke: ${iconColor} !important;
                ${isIconFilled ? `fill: ${iconFilledColor || iconColor} !important;` : ''}
            }
        </style>
        <div 
            class="icon-lucide-pro-wrapper" 
            style="
                display: flex !important;
                ${positionStyles}
                height: 100%;
                width: 100%;
            "
        ></div>
    `;

    const wrapper = root.querySelector('.icon-lucide-pro-wrapper');
    wrapper.append(imgEl); // Append to DOM before calling newSVG so it can be replaced

    // Conditional logic for icon source and calling newSVG
    if (isValidIconNameFormat(properties.icon_name)) {
        imgEl.src = `https://unpkg.com/lucide-static@latest/icons/${properties.icon_name}.svg`;
        newSVG(imgEl, false); // Attempt to load specified icon, newSVG will handle its own fallback if this fails
    } else {
        // No warning logs here as per user request
        imgEl.src = fallbackIconSrc;
        newSVG(imgEl, true); // Directly use fallback and tell newSVG it's a fallback attempt
    }

    function newSVG(img, fallback = false) {
        var imgID = img.id;
        var imgClass = img.className;
        var imgURL = img.src;

        fetch(imgURL).then(function(response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Icon not found');
            }
        }).then(function(text) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, "text/xml");

            // Get the SVG tag, ignore the rest
            var svg = xmlDoc.getElementsByTagName('svg')[0];

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                svg.setAttribute('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                svg.setAttribute('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            svg.removeAttribute('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG won't scale.
            if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
                svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'));
                console.log("viewport set");
            }

            // Replace image with new SVG
            img.parentNode.replaceChild(svg, img);
        }).catch(function(error) {
            if (!fallback) {
                img.src = fallbackIconSrc;
                newSVG(img, true); // Retry with fallback icon
            } else {
                console.error('Fallback icon failed to load:', error);
            }
        });
    }

    imgEl.className = `icon-lucide-pro-${uniqueNumber}`;

    // Set root dimensions and flex properties
    root.style.display = 'flex !important';
    root.style.justifyContent = 'center';
    root.style.alignItems = 'center';
    root.style.overflow = "clip";
}