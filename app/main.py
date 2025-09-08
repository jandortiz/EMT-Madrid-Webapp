from fastapi import FastAPI, Request
from routers.bicimad_router import bicimad_router
from routers.emt_router import emt_router
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


app = FastAPI()
app.include_router(bicimad_router)
app.include_router(emt_router)

app.mount("/frontend", StaticFiles(directory="../frontend"), name="frontend")
templates = Jinja2Templates(directory="../frontend")

@app.get("/")
async def get_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})