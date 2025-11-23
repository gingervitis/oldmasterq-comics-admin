# Old Master Q Comics Admin

I would like to create an admin interface which will replace a system is currently manually managed with thousands of Markdown files.

## Purpose

This Admin should serve to

1. Manage a finite number (approx 11,000 items) of comic strip source images with metadata.
2. Manage the publishing of a comic strip to a website. Each published comic strip has its own set of metadata, including some that tie back to its Source image in first bullet point.

   Currently the comic strips on the website is statically generated from Markdown files, each which includes an identifier that ties it back to a source markdown file that has some publishable fields.

## Admin use cases

The primary usage patterns for the Admin would be

1. See a sortable and filterable list of the source comic images.
   1. It could a table view, or a view of thumbnails like Adobe Bridge explorer
   2. it could be sorted or filtered by names, titles, tags, the presence/absence of fields
2. Be able to edit the fields of each source item.
3. “Publish” a new comic strip to the website from a source item
   1. At this time, since the website runs on markdown files, I would have this Publish process create a new MD file for the published strip to be added to the website repo.
      1. At a later stage we can re-evaluate alternate website development methods.
   2. The published comic strip image will be manually created and uploaded to a web server.

## Requirements

- I would like this Admin interface to be online, accessible from anywhere on the web.
  - In the future I should secure it behind a login/password system.
  - I currently have an account with Vercel, so perhaps hosting it on there would be convenient?
  - I don’t know if it should continue to store data in markdown files, or if data should be migrated to a database.
    - Would I be able to host the admin with a database on Vercel under their Free tier? I would ideally like to keep this free because the usage frequency would likely be low.
- There should be an easy interface to add/remove “tags” for each source strip. Ideally it could be done in bulk on multiple source files, as well as from the listing view as well as the edit view.
- Be able to identify which source item has a published version on the website.
- The website identifies each strip with its own ID number, which increments every time a new one is published. A new one’s id must be n+1 of the previous one. If the newest one is deleted, the next new one must take the same n+1 id. Previously published strips cannot be deleted, in order to maintain the incrementing id system.

## Data structures

### Source Comic Strip Image

A Source Image _may_ consist of either 1 or 2 separate strips. Each strip may be a complete strip, or a partial strip connected a part in another source image.

A source image can display a maximum 6 panels of content.

For source images that contain 2 strips, the “Primary Strip” will be the one that takes up the most panels in the image.

`id`

source file id - this should not be editable

`date`

last edited date of this source image data

`yearRange`

It is currently one of 4 string values, determined by the letter prefix of the file’s `id`

A: 1962 - 1967

B: 1968 - 1972

C: 1973 - 1982

D: 1983 - 1989

`titleChinese`

The Chinese title of the Primary Strip in the source file.

`format`

How many panels the Primary Strip contains.

The value could be 4, 6, 8, 12.

`topImageFileBase`

Which source image file to display for the Admin.

`bottomImageFileBase`

Which source image file display in the admin for the bottom half of the strip.

`titleEnglish`

English title of the Primary Strip.

`tags`

Keywords associated with the Primary Strip.

`altText`

Accessible text to display for the Primary Strip.

`translation`

Notes for translating the text in the source image.

This structure is currently expressed as the Frontmatter of the source Markdown files. For example:

```markdown
---
id: A0247
date: Last Modified
yearRange: 1962 - 1967

titleChinese: 團團轉

format: 6

# for admin display
topImageFileBase: A0247團團轉
bottomImageFileBase:

# editable
titleEnglish: Round and Round
tags: ["hanging", "rope", "twirl", "big potato"]
altText: Old Master Q stands on a platform to hang up a long rope. Big Potato sees the dangling rope and gleefully runs and jumps up to grab it. His large momentum takes him twirling round and around OMQ many times, until he has tied up OMQ into an angry little corkscrew.

translation:
---
```

### Published Comic Strip

The published comic strips on the website have changed formats several times over the past two decades. This data structure reflects some of that eveolution.

`id`

ID number of the published website strip.

`baseFile`

This is the reference to the Source Image file.

`fileRoot`

This is the website image filename that is used to serve to the page.

`fileExtension`

This is the website image file extension of the file to display on the page.

`is450`

Boolean to describe if the website image file is 450px in width.

`isRTL`

Boolean to denote if the website image has content rendered in RTL direction.

`hasBuiltInTitle`

Boolean to denote if the website image includes text for the comic strip title.

`shopId`

ID string of any product in the shop related to this strip.

`description`

Occasional description text that may be displayed on the website with this strip.

`layout`

(this can be ignored)

The website currently is built with 11ty. This field describes which template to use to render the comic strip on the website.

This structure is currently expressed as the Frontmatter of the source Markdown files. For example:

```markdown
---
id: 21
baseFile: B0936

fileRoot: B0936
fileExtension: jpg

is450: false
isRTL: false
hasBuiltInTitle: true

layout: layouts/comics.njk

description: null

shopId:
---
```
