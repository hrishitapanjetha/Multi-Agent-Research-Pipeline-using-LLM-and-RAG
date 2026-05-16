# Multi-Agent Research Pipeline using LLM and RAG

**Live demo →** https://hrishitapanjetha.github.io/Multi-Agent-Research-Pipeline-using-LLM-and-RAG/

An autonomous Agentic AI research system that retrieves real academic papers from ArXiv, performs semantic search using FAISS, and generates a structured literature survey using a multi-agent Large Language Model (LLM) pipeline.

⸻

📌 Project Overview

This project implements an Agentic AI architecture where multiple AI agents collaborate to automate the process of:
	•	Research topic analysis
	•	Academic paper retrieval
	•	Semantic similarity search
	•	Literature summarization
	•	Research report generation

The system uses Retrieval Augmented Generation (RAG) to ensure outputs are grounded in real research papers rather than hallucinated information.

⸻

🎯 Objectives
	•	Automate literature survey generation
	•	Reduce manual research effort
	•	Use real ArXiv papers for knowledge grounding
	•	Maintain citation integrity
	•	Demonstrate agent-based LLM orchestration

⸻

🧠 Core Concepts Used
	•	Agentic AI
	•	Multi-Agent Systems
	•	Large Language Models (LLMs)
	•	Retrieval Augmented Generation (RAG)
	•	Semantic Search
	•	Vector Databases

⸻

🏗 System Architecture

User Topic
↓
Planner Agent
↓
Research Agent
↓
FAISS Semantic Retrieval
↓
Writer Agent
↓
Editor Agent
↓
Final Report Generator

⸻

🤖 Agents in the System

1️⃣ Planner Agent
	•	Extracts research keywords
	•	Generates research questions
	•	Creates structured outline

2️⃣ Research Agent
	•	Fetches papers from ArXiv API
	•	Extracts abstracts
	•	Builds knowledge base

3️⃣ Retrieval Module (RAG)
	•	Converts text into embeddings
	•	Stores vectors in FAISS
	•	Retrieves top relevant research papers

4️⃣ Writer Agent
	•	Generates academic content:
	•	Introduction
	•	Literature Review
	•	Methods Comparison
	•	Challenges
	•	Conclusion

5️⃣ Editor Agent
	•	Improves clarity
	•	Maintains academic tone
	•	Ensures logical structure

6️⃣ Final Report Agent
	•	Compiles all sections
	•	Generates executive summary
	•	Saves final research document

⸻

⚙️ Technologies Used
	•	LLM: Mistral-7B-Instruct
	•	Embeddings: Sentence Transformers (all-MiniLM-L6-v2)
	•	Vector DB: FAISS
	•	Data Source: ArXiv API
	•	Framework: Transformers (Hugging Face)
	•	Optimization: BitsAndBytes 4-bit Quantization
	•	Language: Python

⸻

🚀 Key Features
	•	Multi-agent collaboration
	•	Real-time academic retrieval
	•	Citation-aware generation
	•	Reduced hallucination using RAG
	•	Efficient LLM deployment (quantized model)
	•	Modular and scalable architecture

⸻

📂 Project Workflow
	1.	User inputs a research topic
	2.	Planner agent generates search plan
	3.	Research agent retrieves papers from ArXiv
	4.	FAISS performs semantic similarity search
	5.	Writer agent drafts research survey
	6.	Editor agent refines content
	7.	Final agent compiles and exports report

⸻

🧮 Model Optimization
	•	4-bit quantization for memory efficiency
	•	GPU/CPU auto device selection
	•	Lightweight embedding models
	•	Faster inference with reduced compute
