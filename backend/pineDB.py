from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone
from .postgres import get_db
from .postcrud import get_markdown #need "." here for fastapi server
import uuid
import os


load_dotenv()
pinecone_api_key = os.getenv("PINECONE_API_KEY")
index_host = os.getenv("PINECONE_INDEX_URL")
sample_embed = os.getenv("TESTING_EMBED")
client = OpenAI()

#gets vector embedding of anyt text
def getEmbed(text):
    response = client.embeddings.create(
        input = text,
        model = "text-embedding-3-small"
    )
    return(response.data[0].embedding)


pc = Pinecone(api_key = pinecone_api_key)
index = pc.Index(host=index_host)

#upserts vector to pinecone
def upsertNote(id,title, markdown):
    index.upsert(
    vectors=[{"id" : id, "values" : getEmbed(markdown), "metadata": {"title" : title}}]
)

#update vector embedding of note. 
def updateVector(id1, title, markdown):
    newVector = getEmbed(markdown)
    index.update(id = id1, 
                 values = newVector,
                 set_metadata = {"title": title},
                 namespace = "__default__")
    
#here return top 2 similar notes for gpt  to provide most acccurate answer based on user prompt, return ID of top 2 notes
def getSimilarNotes(prompt):
    vectorRep = getEmbed(prompt)
    response = index.query(
        namespace = "__default__",
        vector = vectorRep,
        top_k = 2,
        include_metadata = True,
        include_values = False
    )
    return(response["matches"][0]["id"], response["matches"][1]["id"])


#for the prompt respone, need the user prompt, the notes in context to the prompt., might change the all DB to this file so i can access all form one
def getPromptResponse(userPrompt):
    top2Notes = getSimilarNotes(userPrompt)
    with get_db() as cursor:
        markdown1 = get_markdown(cursor, top2Notes[0])
        markdown2 = get_markdown(cursor, top2Notes[1])
    
    prompt = f"""
        - Answer the users prompt based on the notes given if you can.
        - Always cite which note by title you’re drawing information from when you reference or quote.
        - If you can't based on given notes state that and provide a alternative answer that doesnt have to include the notes
        - Be concise: aim for 2-4 sentence answers for simple queries, up to a paragraph for deeper explanations.
        - Keep user privacy in mind: never expose unrelated notes or metadata.
        Title of note 1: {markdown1[1]}: {markdown1[0]}
        Title of note 2: {markdown2[1]}: {markdown2[0]}

        User prompt: {userPrompt}
    """
    response = client.responses.create(
        model="gpt-4.1-mini",
        instructions="You are a notebot, an AI assistant",
        input= prompt
    )
    return(response.output_text)
    




#testing prompt responses here:

# print(getPromptResponse("I what is my checklist for my noterious app? ")) 
# similar = getSimilarNotes("What workout do I hit on friday?")
# with get_db() as cursor:
#     result = get_markdown(cursor, "e481261e-7409-49b6-a912-1dbbf18c0faf")

# print(result[1])
# print(result[0])
# print(result[0])
# note1  = "Buy milk, eggs, whole-grain bread, spinach, and avocados for the week."
# title1  = "Grocery List"
# note2  = "Discuss potential features for the task-tracker app: dark mode, API rate limiter, offline support."
# title2  = "Project Brainstorm"
# note3  = "Collect dataset\n– Clean and preprocess text\n– Train baseline logistic regression\n– Evaluate with F1 score\n– Iterate with transformer embeddings"
# title3  = "ML Model Checklist"
# note4  = "Visit Fushimi Inari Shrine at sunrise, eat ramen in Gion district, and take a day trip to Arashiyama bamboo grove."
# title4  = "Trip to Kyoto"
# note5  = "Monday: Chest & triceps; Tuesday: Back & biceps; Wednesday: Rest; Thursday: Legs; Friday: Shoulders & abs."
# title5  = "Daily Workout Plan"
# note6  = "‘Sapiens’ by Yuval Noah Harari, ‘Clean Code’ by Robert C. Martin, ‘Deep Work’ by Cal Newport."
# title6  = "Reading List"
# note7  = "Ingredients: ripe bananas, eggs, oats, baking powder. Instructions: mash bananas, whisk eggs, stir in oats & powder, cook on griddle."
# title7  = "Recipe: Banana Pancakes"
# note8  = "Team agreed on microservice split: auth, billing, user profiles. Next sprint: containerize auth service, write unit tests."
# title8  = "Meeting Summary"
# note9  = "bonjour (hello), merci (thank you), au revoir (goodbye), s’il vous plaît (please), excusez-moi (excuse me)."
# title9  = "French Vocabulary"
# note10 = "Register by June 1, book hotel near venue, prepare lightning talk slides, pack business cards."
# title10 = "Conference To-Dos"
# note11 = "Episode 1: Intro to async Python; Episode 2: Deploying with Docker; Episode 3: Testing strategies in CI/CD pipelines."
# title11 = "Podcast Ideas"
# note12 = "Change HVAC filters every 3 months, clean gutters in spring, reseal deck before winter."
# title12 = "Home Maintenance"
# note13 = "Monthly income: $4,000. Expenses: rent $1,200, utilities $150, groceries $300, savings $500, misc $200."
# title13 = "Budget Breakdown"
# note14 = "Plant tomatoes in full sun, water early morning, use compost to enrich soil, stake vines as they grow."
# title14 = "Gardening Tips"
# note15 = "8–10am: Linear algebra; 10–11am: Break; 11–1pm: French grammar; 2–4pm: Geology mapping assignment."
# title15 = "Study Schedule"
# note16 = "I have a 260 exam on 7/25, and it will be on software mainly, topics that were mentioned that was going to be on that test was, writing simple mips code, analyzing program times, and more"
# title16 = "260 software"




