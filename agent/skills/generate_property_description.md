---
description: Use when the user wants to generate or write a description for a property listing.
---

Use the `web_search_exa` search tool from the Exa connection to research the local area before writing a property description.

1. Identify the property postcode from the property details (use `get_properties` if needed).
2. Perform multiple Exa searches using the postcode and each of these area topics:
   - Nearest public transport (train stations, tube, bus routes, commute times to central London or nearest city)
   - Nearest schools (primary, secondary, Ofsted ratings)
   - Local shops, supermarkets, and amenities
   - Parks, green spaces, and recreational areas
   - Restaurants, cafes, pubs, and nightlife
   - Any notable attractions or landmarks nearby
3. Read the results from each search and extract the key selling points.
4. Write a compelling property description that:
   - Starts with a strong opening line highlighting the property's best feature
   - Includes key property details (bedrooms, bathrooms, property type)
   - Weaves in the local area highlights (transport, schools, shops, attractions)
   - Uses descriptive, inviting language suited to the property type and target market
   - Ends with a call to action (e.g. "book a viewing today")
5. Present the description to the user and offer to adjust the tone or add/remove details before saving it to the property.

Do NOT call `insert_property` with the description unless the user explicitly asks you to save it.
