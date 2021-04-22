# Milestone 1 (Friday 23rd April)

## Dataset

For this project, we plan to use is the [Pantheon](https://pantheon.world/) dataset. The data is available as comma-separated values on the [Pantheon website](https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2).

Pantheon contains data on more than 88,000 famous/memorable people. The attributes we plan to extract from the dataset are **name, age, occupation, place of birth, place of death, and Wikipedia id**.

As the dataset is already clean, it can be used without any cleaning or preprocessing. However, we remove the entries Additionally, we shall use Wikipedia to obtain the images of these famous people.

## Problematic

People are born around the world and only those who have done exemplary activities during the lifetime become famous. However, not many people know great details about them nor there is single-window access to see who these famous people, where did they come from, what did they do. Pantheon solves this problem up to some extent by creating profiles, collecting the metadata of the people such as places of birth and death. Through this project, we aim to provide a one-stop webpage that will show the famous people placed on a world map and give foundational information about the person. Our motivation is to enable users to access the information of these memorable people in multiple dimensions at a single stop.

The primary dimension of the visualization is the map i.e. real-world location. This location creates the second dimension i.e. viewing the birth or death location of these famous people. Moving on, the next dimension is the year. The users can select based on the range of years of birth and death. The last dimension, the users can use is the occupation of famous people. As a consequence, the users can overlay multiple dimensions at the same time. We want the users to get a high-level view of where these famous people come from or which year (century) has which type of people and what did they do.

## Exploratory Data Analysis

The Pantheon data is clearly described in the author's paper -- [Pantheon 1.0, a manually verified dataset of globally famous biographies](https://arxiv.org/abs/1502.07310). Therefore, we scope our analysis on the columns that we plan to use in our visualization in the notebook [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-famousworld/blob/main/notebooks/PantheonExploratory.ipynb).

### Spatial data analysis - birth and death locations

Each location is described by a tuple of floats, interpretable as the latitude and longitude in the [spherical coordinate system](https://en.wikipedia.org/wiki/Reference_ellipsoid#Coordinates). The data is not complete, and birth and death locations are not available for 4.05%, and 56.78% of samples respectively. The death locations are higher as many people are still alive. Among the dead people, 9.74% do not have a death location. The dataset was prepared with a higher emphasis on birthplace completeness, therefore, we will scope on it as well in our visualization. From the analysis of the location, we observe that many of the persons are from Europe.

### Temporal data analysis - birth and death date

The dataset provides two columns for both birth and death dates - "year" and "date". Since the year columns are more complete in terms of missing values, as such detailed information is often unknown for historical figures, we decided to use only "birth year" and "death year" columns. In total, 0.48% of birth years and 54.15% of death years are missing. Similar to death locations, 1.46% of dead people do not have a death year. Many entries are just rough approximations: in the BC era, 44.30% are the century years (divisible by 100), whereas it's the case only for 1.62% of AD samples.

### Categorical data analysis - occupation

The occupation information appears to be extracted from wikidata and not always perfectly fitting the biography. There are no missing values in the occupation data column. Each sample is associated with exactly one occupation. There are 101 distinct occupations. The most frequent one is "POLITICIAN" (15585 occurrences), and the least frequent - "BULLFIGHTER" (1 occurrence).

### Acquired supplementary data

Apart from the above-mentioned analysis, we have created a script to use HTTP requests to obtain images and a short bio of the famous persons from Wikipedia. To do this, we use Wikipedia API. The code for data filtering and enrichment is available [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-famousworld/blob/main/src/process.py)

## Related Work

Primarily, the pantheon [website](https://pantheon.world/) itself provides some visualizations. Their primary landing page shows the profiles of persons selected by pageviews for the Wikipedia edition of a chosen language. On the [visualizations](https://pantheon.world/explore/viz), page they provide a treemap, stacked, line chart grouped by places or occupations. It also provides a map-like visualization. However, it simply places non-interactive markers on the map image. Hovering on the marker will only show the name of the person. To this end, to make the visualization interactive and create an easily accessible interface we plan to create a website with an interactive map and markers placed on the map based on the birth or death date of the people. At the same time, users can filter them based on various attributes mentioned above. When clicked on a marker, the photo of the person as available on Wikipedia, date, and place of birth, date, and place of death along with a summary bio and link to Wikipedia page will be displayed. This will allow hiding the details of data or processing and other scientific plots from the users that are no interested in them but provide a seamless interface to know about these people.
