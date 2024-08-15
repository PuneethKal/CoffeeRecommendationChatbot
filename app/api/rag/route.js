import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from "next/server"
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

export async function POST(req) {
    console.log('POST /api/rag')

    let query = await req.json()
    // console.log(typeof query)

    // Initialize Huggingface Embedding model
    const hf_embeddings = new HuggingFaceInferenceEmbeddings({
        model: 'intfloat/multilingual-e5-large',
        apiKey: process.env.HUGGINGFACE_API_KEY
    })

    // get embeddings for query
    const query_embedding = await hf_embeddings.embedQuery(query)

    // console.log(query_embedding)


    // Initialize Pinecone
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    });
    const pinecone_index = pc.index('multilingualmodel');

    // get top matches relating to query
    const top_matches = await pinecone_index.namespace('coffee-data').query({ vector: query_embedding, topK: 3, includeMetadata: true })

    // console.log(top_matches)

    // Reterive context data from metadata and filter out anything below 0.7 similarity
    const contexts = top_matches.matches
        .filter(item => item.score > 0.81)
        .map(item => item.metadata.text);

    // console.log(contexts)

    //Final query with the context from rag process

    let augmented_query = query
    if (contexts.length > 0) {
        augmented_query = `<CONTEXT>
${contexts.slice(0, 10).join('\n\n-------\n\n')}
-------
</CONTEXT>


MY QUESTION:
${query}`;
    }

    // console.log(augmented_query)

    return NextResponse.json(augmented_query)
}