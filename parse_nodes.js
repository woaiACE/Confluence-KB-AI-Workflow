const fs = require('fs');
const html = fs.readFileSync('confluence AI 工作流.html', 'utf-8');

const match = html.match(/const db = (\{[\s\S]*?\n\s{8}\});\n\s*let currentActiveNodeId/);
if (match) {
    try {
        const jsCode = `
            const db = ${match[1]};
            console.log(Object.keys(db).map(key => {
                const node = db[key];
                return \`Node: \${node.title || 'Untitled'} (ID: \${key}, Type: \${node.type || 'N/A'})\nDescription: \${node.desc || 'N/A'}\n\`;
            }).join('\\n'));
        `;
        eval(jsCode);
    } catch (e) {
        console.log("Error parsing:", e);
    }
} else {
    console.log("Could not find db object. Attempting manual parse.");
    const startIdx = html.indexOf('const db = {');
    const endIdx = html.indexOf('let currentActiveNodeId');
    if (startIdx > -1 && endIdx > -1) {
        const code = html.substring(startIdx, endIdx);
        try {
            eval(code + `
                console.log(Object.keys(db).map(key => {
                    const node = db[key];
                    return \`Node: \${node.title || 'Untitled'} (ID: \${key}, Type: \${node.type || 'N/A'})\nDescription: \${node.desc || 'N/A'}\n\`;
                }).join('\\n'));
            `);
        } catch (e) {
            console.log("Manual parsing failed.", e);
        }
    }
}
