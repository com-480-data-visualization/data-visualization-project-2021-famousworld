#!/usr/bin/env python3

import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('dl_project')

if __name__ == "__main__":
    logger.info("Downloading the CSV...")
    df = pd.read_csv("https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2")
    logger.info("Saving to CSV...")
    df.to_csv("data/dataset.csv")
