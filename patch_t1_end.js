const fs = require('fs');

let html = fs.readFileSync('confluence AI 工作流.html', 'utf-8');

// Insert t1_end HTML
const t1_end_html = `                            <div class="h-connector"></div>
                            <div class="node type-end" onclick="showNode('t1_end')">
                                <span class="node-badge">END</span>
                                <h3 class="node-title">End 节点</h3>
                                <p class="node-desc">结束节点，输出体检结果。</p>
                            </div>`;

html = html.replace(/(<div class="node type-code" onclick="showNode\('t1_n4'\)">[\s\S]*?<\/div>)/, `$1\n${t1_end_html}`);

// Insert t1_end DB object
const t1_end_db = `
            't1_end': {
                badge: 'END', bg: '#ede9fe', color: '#5b21b6',
                title: 'End 节点',
                config: {
                    '节点类型': '输出节点'
                },
                in: 'confidence, cross_refs, has_long_term, primary_type, sections, summary, titles, warning_detail',
                out: 'confidence, cross_refs, has_long_term, primary_type, sections, summary, titles, warning_detail',
                logicTitle: '💡 说明',
                logic: '流程结束，将 N4 提取的内容输出并传回给外层的 Master Agent 渲染。'
            },`;

html = html.replace(/('t2_start': {)/, `${t1_end_db.trim()}\n            $1`);

fs.writeFileSync('confluence AI 工作流.html', html, 'utf-8');
console.log('Done patch_t1_end');
