#!/usr/bin/env python3
"""Main processing pipeline to produce the visualization-compatible CSV."""

import pandas as pd
import logging
import requests
import csv
import wikipedia
from tqdm import tqdm

tqdm.pandas()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('dl_project')


def find_commons_image(ids):
    """Query wikidata for the images describing the people."""
    query = "SELECT ?item ?pic WHERE { VALUES ?item {" + ' '.join(ids) + "}. ?item wdt:P18 ?pic}"
    result = requests.get("https://query.wikidata.org/sparql",
                          params={'query': query},
                          headers={'Accept': 'text/csv'}).text
    data = list(csv.reader(result.split("\r\n"), delimiter=',', quotechar='"'))[:-1]
    df = pd.DataFrame(data[1:], columns=data[0])
    return df


if __name__ == "__main__":
    logger.info("Downloading the CSV...")
    df = pd.read_csv("https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2")
    # Work on a small subset to decrease bandwidth
    df = df[:50]

    # Drop unused columns
    df.drop(["prob_ratio", "gender", "twitter", "alive", "l_", "age", "coefficient_of_variation"],
            axis=1, inplace=True)

    logger.info("Getting corresponding images...")
    # Find the images URL in wikidata
    images = find_commons_image("wd:"+df.wd_id)
    images.item = images.item.str.replace("http://www.wikidata.org/entity/", "")
    df = df.merge(images, left_on='wd_id', right_on='item', how='left').drop(["item"], axis=1)

    logger.info("Getting wikipedia summaries...")
    # Get wikipedia page summary for each person
    df["summary"] = df.progress_apply(lambda row: wikipedia.page(pageid=row.wp_id).summary, axis=1)

    logger.info("Saving to CSV...")
    df.to_csv("data/dataset.csv", index=False)
