# Milestone 1 (Friday 23rd April)

## Dataset

For this project, we plan to use is the [Pantheon](https://pantheon.world/) dataset. The data is available as comma-separated values on the [Pantheon website](https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2).

Pantheon contains data on more than 88,000 famous/memorable people. The attributes we plan to extract from the dataset are \*\*name, age, occupation, place of birth, place of death, and link to wikipedia page.

As the dataset is already clean, it can be used without any cleaning or preprocessing. Additionally, as the dataset is self contained, we do not plan to use any additional datasets.

## Problematic

People are born around the world and only those who have done exemplary activities during the lifetime become famous. However, not many people know great details about them nor there is a single window aceess to see whose these famous people, where did they come from, what did they do. Pantheon solves this problem up to some extent by creating profiles, collecting the meta of the people such places of birth and death. However, the visualisation are neither intutive nor asthetic. Thus, through this project, we aim to provide a one stop webpage that will show the famous people placed on a world map and give foundational information about the person. Our motivation is to enable users to access the information of these memorable people in multiple dimensions.

Primary dimension of the visualisation is the map i.e. real world location. This location creates the second dimension i.e. vieweing the birth or death location of these famous people. Moving on, the next dimension is the year. The users can select based on the range of years of births or deaths. The last dimension, the users can use is the occupation oid the famous people. As a consequence, the users can overlay mutiple dimensions at the sametime. We want the users to get a high level view of where these famous people come from or which year (century) has which type of people and what did they do.

## Exploratory Data Analysis

The Pantheon data is clearly described in the author's paper -- [Pantheon 1.0, a manually verified dataset of globally famous biographies](https://arxiv.org/abs/1502.07310). Therefore, we will skip the detailed description of the dataset as a whole, and will scope on the columns that we plan to use in our analysis. The notebook for the same can be found [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-famousworld/blob/main/notebooks/PantheonExploratory.ipynb).

### Spatial data analysis - birth and death locations

Each location is described by tuple of floats, interpretable as the latitude and longitude in the [spherical coordinate system](https://en.wikipedia.org/wiki/Reference_ellipsoid#Coordinates). The data is not complete, and birth and deaths are not precised for 4.05%, and 56.78% of samples respectively. The dataset was apparently prepared with higher emphasis of birth date completeness, therefore, we will scope on it as well in out visualization.

### Temporal data analysis - birth and death date

The dataset provides two columns for both birth and death dates - "year" and "date". Since the year columns are more complete in terms of missing values, as such detailed information are often unknown for historical figures, we decided to use only "birthyear" and "deathyear" columns. In total, 0.48% of birthyears and 54.15% of deathyears are missing. Many entries are just rough approximations: in BC era, 44.30% are the century years (divisible by 100), whereas it's the case only for 1.62% of AD samples.

### Categorical data analysis - occupation

The occupation information appears to be extracted from wikidata and not always perfectly fitting the biography. There are no missing values in occupation data column. Each sample is associated with exactly one occupation. There are 101 distinct occupations. The most frequent one is "POLITICIAN" (15585 occurences), and the least frequent - "BULLFIGHTER" (1 occurence).

### Acquired supplementary data

Apart from the above mentioned analysis, we create script to use HTTP request to obtain images and short bio of the famous persons from Wikipedia. To do this, we use Wikipedia API. The code for data filtering and enrichment is available [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-famousworld/blob/main/src/process.py)

## Related Work

Primarily, the pantheon [website](https://pantheon.world/) itself provides some visualisation's. Their primary landing page shows the profiles of persons selected by pageviews for the wikipedia edition of a chosen language. In the [visualisations](https://pantheon.world/explore/viz) page they provide a tree map, stacked, line chart grouped by places or occupations. It also provides a map like visualisation. However, it simple places non interactive markers on the map image. Hovering on the marker will only show the name of the person. To this end, to make the visualisation interactive and create easily accessible interface we plan to create a website with an interactive map and markers placed on the map based on birth or death date of the people. At the same time users can filter them based on various attributes mentioned above. When clicked on a marker, the photo of the person as avaiable on wikipedia, date and place of birth, date and place of death along with a summary bio and link to wikipedia page will be displayed. This will allow to hide the deatils of data or processing and other scientific plots from the users that are no interested in them but provide seamless interface to know about these people.
