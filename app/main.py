from fastapi import FastAPI, Request
from routers.bicimad_router import router
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


app = FastAPI()
app.include_router(router)
app.mount("/frontend", StaticFiles(directory="../frontend"), name="frontend")
templates = Jinja2Templates(directory="../frontend")

@app.get("/")
async def get_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})