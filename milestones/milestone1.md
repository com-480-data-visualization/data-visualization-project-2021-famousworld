# Milestone 1 (Friday 23rd April)

## Dataset

For this project, we plan to use is the [Pantheon](https://pantheon.world/) dataset. The data is available as comma-separated values on the [Pantheon website](https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2).

Pantheon contains data on more than 88,000 famous/memorable people. The attributes we plan to extract from the dataset are \*\*name, age, occupation, place of birth, place of death, and link to wikipedia page.

As the dataset is already clean, it can be used without any cleaning or preprocessing. Additionally, as the dataset is self contained, we do not plan to use any additional datasets.

## Problematic

People are born around the world and only those who have done exemplary activities during the lifetime become famous. However, not many people know great details about them nor there is a single window aceess to see whose these famous people, where did they come from, what did they do. Pantheon solves this problem up to some extent by creating profiles, collecting the meta of the people such places of birth and death. However, the visualisation are neither intutive nor asthetic. Thus, through this project, we aim to provide a one stop webpage that will show the famous people placed on a world map and give foundational information about the person. Our motivation is to enable users to access the information of these memorable people in multiple dimensions.

Primary dimension of the visualisation is the map i.e. real world location. This location creates the second dimension i.e. vieweing the birth or death location of these famous people. Moving on, the next dimension is the year. The users can select based on the range of years of births or deaths. The last dimension, the users can use is the occupation oid the famous people. As a consequence, the users can overlay mutiple dimensions at the sametime. We want the users to get a high level view of where these famous people come from or which year (century) has which type of people and what did they do.

## Exploratory Data Analysis

In the Exploratory Data Analysis (EDA) of the pantheon dataset, we obtain the following information. The notebook for the same can be found [here](). As the data is already clean, we do the following analysis to understand the distribution of the data, and eventually enrich the dataset with wikipedia data of our interest.

### The dataset content
The Pantheon data is clearly described in the author's paper -- [Pantheon 1.0, a manually verified dataset of globally famous biographies](https://arxiv.org/abs/1502.07310). Therefore, we will skip the detailed description of the dataset as a whole, and will scope on the columns that we plan to use in our analysis.

### Spatial data analysis - birth and death locations

The dataset contains the birth and death locations of the samples (famous people).
Each location is described by tuple of floats, interpretable as the latitude (-90.0, 90.0) and longitude (-180.0, 180.0) in the [spherical coordinate system](https://en.wikipedia.org/wiki/Reference_ellipsoid#Coordinates). The data is not complete, and 3.94% of samples don't have their birth location precised, whereas 58.98% of samples doesn't have their death position precised! Therefore, we will scope on birth locations in this visualization.
The mean birth position of the famous person in the history lies on (38.057272, 2.035184), which points on the area on Mediterranean between Algier and Ibiza. 

**TODO: Some interesting facts about most-south-born and most-north-born person**

### Temporal data analysis - birth and death date



3. Analysis on Year of Births

   - xxx

4. Analysis on Year of Deaths

   - xxx

### Categorical data analysis - occupation and other information of limited interest

   - xxx


### Acquired supplementary data
Apart from the above mentioned analysis, we create script to use HTTP request to obtain images and short bio of the famous persons from Wikipedia.

## Related Work

Primarily, the pantheon [website](https://pantheon.world/) itself provides some visualisation's. Their primary landing page shows the profiles of persons selected by pageviews for the wikipedia edition of a chosen language. In the [visualisations](https://pantheon.world/explore/viz) page they provide a tree map, stacked, line chart grouped by places or occupations. It also provides a map like visualisation. However, it simple places non interactive markers on the map image. Hovering on the marker will only show the name of the person. To this end, to make the visualisation interactive and create easily accessible interface we plan to create a website with an interactive map and markers placed on the map based on birth or death date of the people. At the same time users can filter them based on various attributes mentioned above. When clicked on a marker, the photo of the person as avaiable on wikipedia, date and place of birth, date and place of death along with a summary bio and link to wikipedia page will be displayed. This will allow to hide the deatils of data or processing and other scientific plots from the users that are no interested in them but provide seamless interface to know about these people.
