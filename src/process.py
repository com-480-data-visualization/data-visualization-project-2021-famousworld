#!/usr/bin/env python3
"""Main processing pipeline to produce the visualization-compatible CSV."""

import pandas as pd
import logging
import requests
import csv
import wikipedia
from tqdm import tqdm
import time

tqdm.pandas()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('dl_project')


def find_commons_image(ids):
    """Query wikidata for the images describing the people."""
    finished = False
    while not finished:
        try:
            query = "SELECT ?item ?pic WHERE { VALUES ?item {" + ' '.join(ids) + "}. ?item wdt:P18 ?pic}"
            result = requests.get("https://query.wikidata.org/sparql",
                                  params={'query': query},
                                  headers={'Accept': 'text/csv'}).text
            data = list(csv.reader(result.split("\r\n"), delimiter=',', quotechar='"'))[:-1]
            df = pd.DataFrame(data[1:], columns=data[0])
            finished = True
        except Exception:
            print("It broke again... Resubmitting")
            time.sleep(5)
            continue
    return df


if __name__ == "__main__":
    logger.info("Downloading the CSV...")
    df = pd.read_csv("https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2")

    # Only individuals
    df = df[~df.is_group]
    df.drop(["prob_ratio", "gender", "twitter", "alive",
             "l_", "l", "age", "coefficient_of_variation", "slug",
             "birthdate", "deathdate", "bplace_geonameid",
             "dplace_geonameid", "dplace_geacron_name",
             "dplace_lat", "dplace_lon", "bplace_geacron_name", "non_en_page_views",
             "hpi_raw", "is_group"],
            axis=1, inplace=True)

    # Required fields
    df = df[~df.bplace_lon.isna()]
    df = df[~df.bplace_lat.isna()]
    df = df[~df.birthyear.isna()]

    # Weird bug in data
    df.loc[2116, "wp_id"] = 65527371
    df.loc[3842, "wp_id"] = 67200122

    logger.info("Getting corresponding images...")
    subdfs = []

    # Sparql allows only 500 at time
    for i in tqdm(range(10)):
        df_selected = df[(500*i):(500*(i+1))]
        # Find the images URL in wikidata
        images = find_commons_image("wd:"+df_selected.wd_id)
        images.item = images.item.str.replace("http://www.wikidata.org/entity/", "")
        images = images.groupby("item").first()
        subdfs.append(df_selected.merge(images, left_on='wd_id', right_on='item', how='left'))
        time.sleep(5)

    df = pd.concat(subdfs)
    df = df[~df.pic.isna()]

    logger.info("Getting wikipedia summaries...")
    # Get wikipedia page summary for each person

    df["summary"] = df.progress_apply(lambda row: wikipedia.page(pageid=row.wp_id).summary, axis=1)

    logger.info("Saving to CSV...")
    df.to_csv("data/dataset.csv", index=False)
