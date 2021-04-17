# Milestone 1 (Friday 23rd April)

## Dataset

For this project, we plan to use is the [Pantheon](https://pantheon.world/) dataset. The data is available as comma-separated values on the [Pantheon website](https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2).

Pantheon contains data on more than 88,000 famous/memorable people. The attributes we plan to extract from the dataset are \*\*name, age, occupation, place of birth, place of death, and link to wikipedia page.

As the dataset is already clean, it can be used without any cleaning or preprocessing. Additionally, as the dataset is self contained, we do not plan to use any additional datasets.

## Problematic

People are born around the world and only those who have done exemplary activities during the lifetime become famous. However, not many people know great details about them nor there is a single window aceess to see whose these famous people, where did they come from, what did they do. Pantheon solves this problem up to some extent by creating profiles, collecting the meta of the people such places of birth and death. However, the visualisation are neither intutive nor asthetic. Thus, through this project, we aim to provide a one stop webpage that will show the famous people placed on a world map and give foundational information about the person. Our motivation is to enable users to access the information of these memorable people in multiple dimensions.

Primary dimension of the visualisation is the map i.e. real world location. This location creates the second dimension i.e. vieweing the birth or death location of these famous people. Moving on, the next dimension is the year. The users can select based on the range of years of births or deaths. The last dimension, the users can use is the occupation oid the famous people. As a consequence, the users can overlay mutiple dimensions at the sametime. We want the users to get a high level view of where these famous people come from or which year (century) has which type of people and what did they do.

## Exploratory Data Analysis

In the Exploratory Data Analysis (EDA) of the pantheon dataset, we obtain the following information. The notebook for the same can be found [here](). As the data is already clean, we do the following analysis to understand the distribution of the data.

We divided our first exploratory analysis in 4 parts taking different points of view. Here are the main findings of each one of them:

1. Analysis on Place of Births

   - xxx

2. Analysis on Place of Deaths

   - xxx

3. Analysis on Year of Births

   - xxx

4. Analysis on Year of Deaths

   - xxx

5. Analysis on occupation

   - xxx

Apart from the above mentioned analysis, we create script to use HTTP request to obtain images and short bio of the famous persons from Wikipedia.

## Related Work

Primarily, the pantheon [website](https://pantheon.world/) itself provides some visualisation's. Their primary landing page shows the profiles of persons selected by pageviews for the wikipedia edition of a chosen language. In the [visualisations](https://pantheon.world/explore/viz) page they provide a tree map, stacked, line chart grouped by places or occupations. It also provides a map like visualisation. However, it simple places non interactive markers on the map image. Hovering on the marker will only show the name of the person. To this end, to make the visualisation interactive and create easily accessible interface we plan to create a website with an interactive map and markers placed on the map based on birth or death date of the people. At the same time users can filter them based on various attributes mentioned above. When clicked on a marker, the photo of the person as avaiable on wikipedia, date and place of birth, date and place of death along with a summary bio and link to wikipedia page will be displayed. This will allow to hide the deatils of data or processing and other scientific plots from the users that are no interested in them but provide seamless interface to know about these people.
