# Confluence AI Agent Workflow

This repository contains the configuration and workflow visualization for a Multi-Agent Knowledge Base system designed to automatically process, diagnose, and structure rough drafts into standardized Confluence articles.

The core of the system is a **Master Routing Agent** that coordinates two sub-tools (workflows) based on user interaction:
1. **Tool 1: KB_Diagnoser** (Knowledge Base Diagnoser)
2. **Tool 2: KB_Generator** (Knowledge Base Generator)

Below is a detailed breakdown of each node in the workflow.

---

## 🤖 Master Agent (主控路由智能体)

- **ID**: `master`
- **Role**: Chief Knowledge Base Editor for the Cross-border E-commerce Logistics Center (Service Operations Center).
- **Model**: `gpt-5.4-mini`
- **Inputs**: User natural language input or file upload (Word/PDF).
- **Outputs**: Drives the underlying tools' parameters and returns markdown-rendered panels to the user.
- **Workflow**:
    1. **Phase 1 (Diagnosis)**: Receives raw text/file and passes it to Tool 1 (KB_Diagnoser) to perform a structural check. Renders an "N5 Structure Confirmation Panel" for the user to review and interact with.
    2. **Phase 2 (Generation)**: Based on the user's feedback (e.g., chosen title, sections), extracts the decision parameters and activates Tool 2 (KB_Generator).
    3. **Phase 3 (Publishing)**: Receives the generated markdown and metadata from Tool 2 and presents the final "N8 Final Review and Publishing Panel".

---

## 🛠️ Tool 1: KB_Diagnoser Workflow

This workflow is responsible for taking the raw user input, checking against existing knowledge base articles, and returning a structured diagnosis (suggested titles, sections, types, and warnings).

### Node: Start 节点
- **ID**: `t1_start`
- **Type**: `START`
- **Inputs**: External data passed from the Master Agent.
- **Outputs**: `input_text` (String)

### Node: 条件分支 (If/Else)
- **ID**: `t1_if`
- **Type**: `IF ELSE`
- **Inputs**: `Start.{input_text}`
- **Outputs**: IF branch (flows to End, e.g., if input is too short) / ELSE branch (flows to N2 Knowledge Retrieval).

### Node: 知识库检索 (Knowledge Retrieval)
- **ID**: `t1_n2`
- **Type**: `N2 KNOWLEDGE RETRIEVAL`
- **Inputs**: Query Text: `Start.{input_text}`
- **Outputs**: `chunks` (Array[Object]) - Relevant chunks from the existing KB.

### Node: 检索数据清洗 (Data Cleaning)
- **ID**: `t1_code_2_5`
- **Type**: `2_5 CODE EXECUTOR`
- **Inputs**: `retrieval_output`: `N2 Knowledge Retrieval.(chunks)`
- **Outputs**: `clean_context` (String) - Cleaned up reference context.

### Node: 定性诊断与结构化 (L3 LLM - Diagnosis)
- **ID**: `t1_l3`
- **Type**: `L3 LLM`
- **Inputs**:
    - Raw Draft: `Start.{input_text}`
    - Reference Context: `2_5Code Executor.{clean_context}`
- **Outputs**: `response_str` (String), `output_attachments`, `token_usage`

### Node: 诊断变量安全解包器 (N4 Code Executor - Unpacker)
- **ID**: `t1_n4`
- **Type**: `N4 CODE EXECUTOR`
- **Inputs**: `response_str`: `L3 LLM.{response_str}`
- **Outputs**: Parses the LLM JSON into individual flat variables: `confidence`, `cross_refs`, `has_long_term`, `primary_type`, `sections`, `summary`, `titles`, `warning_detail`.

### Node: End 节点
- **ID**: `t1_end`
- **Type**: `END`
- **Inputs**: Output variables from N4.
- **Outputs**: Returns the flat variables back to the Master Agent to render the N5 Panel.

---

## 🛠️ Tool 2: KB_Generator Workflow

This workflow takes the finalized parameters (approved by the user in Phase 1) and generates the final, strictly formatted markdown article.

### Node: Start 节点
- **ID**: `t2_start`
- **Type**: `START`
- **Inputs**: External data passed from the Master Agent after user confirmation.
- **Outputs**: `confirmed_sections`, `confirmed_title`, `confirmed_type`, `images`, `original_text`.

### Node: 长文高压约束扩写 (N6 LLM - Generator)
- **ID**: `t2_n6`
- **Type**: `N6 LLM`
- **Inputs**: Variables from Start node (`confirmed_sections`, `confirmed_title`, `confirmed_type`, `images`, `original_text`).
- **Outputs**: `response_str` (String - A JSON string containing the final article).

### Node: 终稿要素解包器 (N7 Code Executor - Unpacker)
- **ID**: `t2_n7`
- **Type**: `N7 CODE EXECUTOR`
- **Inputs**: `generator_output`: `N6 LLM.{response_str}`
- **Outputs**: Safely parses the JSON output from N6 and extracts: `archive_paths` (Array[String]), `content` (String), `metadata` (Object), `placeholders` (Array[String]).

### Node: End 节点
- **ID**: `t2_end`
- **Type**: `END`
- **Inputs**: Output variables from N7.
- **Outputs**: Returns `archive_paths`, `content`, `metadata`, and `placeholders` back to the Master Agent to render the N8 Final Panel.
