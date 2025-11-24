# API Routes Documentation

## Source Strips

### List Source Strips
`GET /api/source-strips`

Returns a paginated list of source strips with filtering and sorting.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50) - Items per page
- `sortBy` (string, default: 'id') - Field to sort by
- `sortOrder` ('asc' | 'desc', default: 'asc') - Sort direction
- `yearRange` (string) - Filter by year range
- `format` (number) - Filter by panel count (4, 6, 8, 12)
- `rating` (number | 'null') - Filter by rating (null, 1, 2, 3)
- `tags` (string) - Comma-separated tag names
- `search` (string) - Search in id, titleChinese, titleEnglish

**Response:**
```json
{
  "data": [
    {
      "id": "A0247",
      "date": "2025-11-23T20:19:46.218Z",
      "yearRange": "1962 - 1967",
      "titleChinese": "團團轉",
      "format": 6,
      "topImageFileBase": "A0247團團轉",
      "bottomImageFileBase": null,
      "titleEnglish": "Round and Round",
      "altText": null,
      "translation": null,
      "rating": 3,
      "tags": ["hanging", "rope", "twirl", "big potato"],
      "hasPublished": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 3,
    "totalPages": 1
  }
}
```

**Examples:**
- `/api/source-strips?rating=3` - Get all strips with rating 3
- `/api/source-strips?yearRange=1962 - 1967` - Get strips from 1962-1967
- `/api/source-strips?tags=rope,hanging` - Get strips with specific tags
- `/api/source-strips?search=round` - Search for "round" in titles

### Get Single Source Strip
`GET /api/source-strips/[id]`

Returns a single source strip with full details.

**Response:**
```json
{
  "id": "A0247",
  "date": "2025-11-23T20:19:46.218Z",
  "yearRange": "1962 - 1967",
  "titleChinese": "團團轉",
  "format": 6,
  "topImageFileBase": "A0247團團轉",
  "bottomImageFileBase": null,
  "titleEnglish": "Round and Round",
  "altText": null,
  "translation": null,
  "rating": 3,
  "tags": [
    { "id": "tag1", "name": "hanging" },
    { "id": "tag2", "name": "rope" }
  ],
  "publishedStrips": []
}
```

### Update Source Strip
`PATCH /api/source-strips/[id]`

Updates a source strip's metadata and tags.

**Request Body:**
```json
{
  "titleChinese": "團團轉",
  "titleEnglish": "Round and Round",
  "format": 6,
  "yearRange": "1962 - 1967",
  "topImageFileBase": "A0247團團轉",
  "bottomImageFileBase": null,
  "altText": "Description of the strip",
  "translation": "Translation notes",
  "rating": 3,
  "tags": ["hanging", "rope", "twirl", "big potato"]
}
```

**Response:** Updated source strip object

**Notes:**
- Tags are automatically created if they don't exist
- Tag names are normalized (trimmed and lowercased)
- All existing tags are replaced with the new list

### Delete Source Strip
`DELETE /api/source-strips/[id]`

Deletes a source strip. Cannot delete strips with published versions.

**Response:**
```json
{
  "message": "Source strip deleted successfully"
}
```

**Error Response (if published):**
```json
{
  "error": "Cannot delete source strip with published versions"
}
```

## Tags

### List All Tags
`GET /api/tags`

Returns all tags with usage counts.

**Query Parameters:**
- `search` (string) - Filter tags by name

**Response:**
```json
[
  {
    "id": "tag1",
    "name": "hanging",
    "usageCount": 1,
    "createdAt": "2025-11-23T20:19:46.173Z"
  },
  {
    "id": "tag2",
    "name": "rope",
    "usageCount": 1,
    "createdAt": "2025-11-23T20:19:46.173Z"
  }
]
```

### Create Tag
`POST /api/tags`

Creates a new tag.

**Request Body:**
```json
{
  "name": "new-tag"
}
```

**Response:** Created tag object

**Notes:**
- Tag names are normalized (trimmed and lowercased)
- Returns 409 error if tag already exists

### Rename Tag
`PATCH /api/tags/[id]`

Renames a tag. All strips using this tag will automatically use the new name.

**Request Body:**
```json
{
  "name": "updated-name"
}
```

**Response:** Updated tag object

### Delete Tag
`DELETE /api/tags/[id]`

Deletes an unused tag. Cannot delete tags that are assigned to any strips.

**Response:**
```json
{
  "message": "Tag deleted successfully"
}
```

**Error Response (if in use):**
```json
{
  "error": "Cannot delete tag. It is used by 5 source strip(s)"
}
```

## Error Responses

All endpoints return error responses in this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid data)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error
