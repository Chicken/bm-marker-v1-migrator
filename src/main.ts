const input = document.getElementById("input") as HTMLTextAreaElement;
const output = document.getElementById("output") as HTMLDivElement;
const textOutput = document.getElementById("status") as HTMLParagraphElement;

function parse(input: string): Record<string, string> {
    if (input.length === 0) return {};
    const { markerSets } = JSON.parse(input);
    const maps = {};
    const mapKeys = new Set<string>(markerSets.flatMap((s) => s.marker.map((m) => m.map)));
    const setKeys = new Set<string>(markerSets.map((s) => s.id));

    for (const map of mapKeys) {
        maps[map] = "marker-sets: {\n";
        for (const setKey of setKeys) {
            const set = markerSets.find((s) => s.id === setKey);
            const markersForMap = set.marker.filter((m) => m.map === map);
            if (markersForMap.length === 0) continue;
            maps[map] += `  ${setKey}: {\n`;
            maps[map] += `    label: "${set.label ?? "Unnamed set"}"\n`;
            maps[map] += `    toggleable: ${set.toggleable ?? true}\n`;
            maps[map] += `    default-hidden: ${set.defaultHide ?? false}\n`;
            maps[map] += `    sorting: ${set.sorting ?? 0}\n`;
            maps[map] += `    markers: {\n`;
            for (const marker of markersForMap) {
                maps[map] += `      ${marker.id}: {\n`;
                maps[map] += `        type: ${marker.type}\n`;
                maps[map] += `        position: { `;
                maps[map] += `x: ${marker.position.x}, `;
                maps[map] += `y: ${marker.position.y}, `;
                maps[map] += `z: ${marker.position.z} `;
                maps[map] += `}\n`;
                maps[map] += `        label: "${marker.label}"\n`;
                if ("sorting" in marker) maps[map] += `        sorting: ${marker.sorting}\n`;
                if ("listed" in marker) maps[map] += `        listed: ${marker.listed}\n`;
                if ("minDistance" in marker)
                    maps[map] += `        min-distance: ${marker.minDistance}\n`;
                if ("maxDistance" in marker)
                    maps[map] += `        max-distance: ${marker.maxDistance}\n`;
                if ("detail" in marker) maps[map] += `        detail: "${marker.detail}"\n`;
                if ("icon" in marker) maps[map] += `        icon: "${marker.icon}"\n`;
                if ("anchor" in marker) {
                    maps[map] += `        anchor: { `;
                    maps[map] += `x: ${marker.anchor.x}, `;
                    maps[map] += `y: ${marker.anchor.y} `;
                    maps[map] += `}\n`;
                }
                if ("html" in marker) maps[map] += `        html: "${marker.html}"\n`;
                if ("line" in marker) {
                    maps[map] += `        line: [\n`;
                    for (const point of marker.line) {
                        maps[map] += `          { `;
                        maps[map] += `x: ${point.x}, `;
                        maps[map] += `y: ${point.y}, `;
                        maps[map] += `z: ${point.z} `;
                        maps[map] += `}\n`;
                    }
                    maps[map] += `        ]\n`;
                }
                if ("link" in marker)
                    maps[map] += `        link: ${marker.link ? `"${marker.link}"` : null}\n`;
                if ("newTab" in marker) maps[map] += `        new-tab: ${marker.newTab}\n`;
                if ("depthTest" in marker) maps[map] += `        depth-test: ${marker.depthTest}\n`;
                if ("lineWidth" in marker) maps[map] += `        line-width: ${marker.lineWidth}\n`;
                if ("lineColor" in marker) {
                    maps[map] += `        line-color: { `;
                    maps[map] += `r: ${marker.lineColor.r}, `;
                    maps[map] += `g: ${marker.lineColor.g}, `;
                    maps[map] += `b: ${marker.lineColor.b}, `;
                    maps[map] += `a: ${marker.lineColor.a} `;
                    maps[map] += `}\n`;
                }
                if ("shape" in marker) {
                    maps[map] += `        shape: [\n`;
                    for (const point of marker.shape) {
                        maps[map] += `          { `;
                        maps[map] += `x: ${point.x}, `;
                        maps[map] += `z: ${point.z} `;
                        maps[map] += `}\n`;
                    }
                    maps[map] += `        ]\n`;
                }
                if ("shapeY" in marker) maps[map] += `        shape-y: ${marker.shapeY}\n`;
                if ("fillColor" in marker) {
                    maps[map] += `        fill-color: { `;
                    maps[map] += `r: ${marker.fillColor.r}, `;
                    maps[map] += `g: ${marker.fillColor.g}, `;
                    maps[map] += `b: ${marker.fillColor.b}, `;
                    maps[map] += `a: ${marker.fillColor.a} `;
                    maps[map] += `}\n`;
                }
                if ("shapeMinY" in marker)
                    maps[map] += `        shape-min-y: ${marker.shapeMinY}\n`;
                if ("shapeMaxY" in marker)
                    maps[map] += `        shape-max-y: ${marker.shapeMaxY}\n`;
                maps[map] += `      }\n`;
            }
            maps[map] += "    }\n";
            maps[map] += "  }\n";
        }
        maps[map] += "}";
    }

    return maps;
}

input.addEventListener("input", () => {
    try {
        const maps = parse(input.value);
        output.innerHTML = "";
        if (Object.keys(maps).length === 0) {
            textOutput.innerText = "";
            return;
        }
        textOutput.innerText = "Marker-set configs for each map:";
        for (const [world, config] of Object.entries(maps)) {
            const header = document.createElement("h2");
            header.innerText = world + ".conf";
            const out = document.createElement("textarea");
            out.readOnly = true;
            out.spellcheck = false;
            out.value = config;
            output.appendChild(header);
            output.appendChild(out);
        }
    } catch (e) {
        output.innerHTML = "";
        textOutput.innerText = "Error parsing input.";
        console.error(e);
    }
});

input.dispatchEvent(new Event("input"));
