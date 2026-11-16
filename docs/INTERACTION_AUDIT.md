# Interaction Audit (v4)

Generated from an automated run in real Chrome (playwright-core) against `next start` production builds on 2026-11-16.
Three server configurations were used: webhook accepting (local test receiver), **no handler configured**, and webhook failing (HTTP 500).

**Result: 84 checks, 0 failed.**

| # | Element | Expected action | Actual behaviour | Result |
|---|---|---|---|---|
| 1 | Page / | Loads with HTTP 200 | HTTP 200 | PASS |
| 2 | Page /about | Loads with HTTP 200 | HTTP 200 | PASS |
| 3 | Page /services | Loads with HTTP 200 | HTTP 200 | PASS |
| 4 | Page /services/conference-booking | Loads with HTTP 200 | HTTP 200 | PASS |
| 5 | Page /services/shooting-locations | Loads with HTTP 200 | HTTP 200 | PASS |
| 6 | Page /portfolio | Loads with HTTP 200 | HTTP 200 | PASS |
| 7 | Page /contact | Loads with HTTP 200 | HTTP 200 | PASS |
| 8 | Page /book | Loads with HTTP 200 | HTTP 200 | PASS |
| 9 | Page /book?type=event | Loads with HTTP 200 | HTTP 200 | PASS |
| 10 | Page /book?service=studio-booking | Loads with HTTP 200 | HTTP 200 | PASS |
| 11 | All <a> elements on all pages | Every link has a real destination | 0 empty/#/javascript links | PASS |
| 12 | Internal link targets (36 unique) | All resolve 200 | all 200 | PASS |
| 13 | Header nav: About | Navigates to /about, marked active | URL /about, active=About | PASS |
| 14 | Header nav: Services | Navigates to /services, marked active | URL /services, active=Services | PASS |
| 15 | Header nav: Portfolio | Navigates to /portfolio, marked active | URL /portfolio, active=Portfolio | PASS |
| 16 | Header nav: Contact | Navigates to /contact, marked active | URL /contact, active=Contact | PASS |
| 17 | Header nav: Home | Navigates to /, marked active | URL /, active=Home | PASS |
| 18 | Header logo | Navigates home | / | PASS |
| 19 | Header: Book a Shoot | Opens booking modal (shoot) | modal "Book a Shoot" | PASS |
| 20 | Booking modal: focus + Esc | Focus moves into modal; Esc closes; focus returns to trigger | inModal=true, returned=true | PASS |
| 21 | Hero: View Our Work | Navigates to /portfolio | /portfolio | PASS |
| 22 | Capability bar: Conferences & Events | Opens conference service page | /services/conference-booking | PASS |
| 23 | Capturing Moments tile: Weddings | Opens wedding service page | /services/wedding-photography | PASS |
| 24 | About: More About Us | Navigates to /about | /about | PASS |
| 25 | Services: Explore Our Services | Navigates to /services | /services | PASS |
| 26 | Services: service row (Wedding) | Opens /services/wedding-photography | /services/wedding-photography | PASS |
| 27 | Services: Book a Shoot | Opens "Book a Shoot" form | modal "Book a Shoot" — options: Commercial Photography, Wedding Photography, Portrait Photography, Videography, Event Photography, Advertising & Brand Content | PASS |
| 28 | Services: Book an Event | Opens "Book an Event" form | modal "Book an Event" — options: Conference Booking, Event Hall Booking, Event Production Coordination | PASS |
| 29 | Services: Find Your Location | Opens "Find Your Location" form | modal "Find Your Location" — options: Photography Studio Booking, Indoor Shooting Location, Outdoor Shooting Location | PASS |
| 30 | Featured Works card | Opens project preview modal | dialog "Commercial Shoot preview" | PASS |
| 31 | Project modal: arrow key | Moves to next project | dialog "Cinematic Portraits preview" | PASS |
| 32 | Project modal: Book a project like this | Closes preview, opens booking prefilled with the project's service | modal "Book a Shoot", step "2Details" | PASS |
| 33 | Scroll lock released after modals | html overflow restored | overflow="" | PASS |
| 34 | Featured Works: View all projects | Navigates to /portfolio | /portfolio | PASS |
| 35 | Why Choose Us: Let's Plan Your Project | Opens general project form | modal "Let’s Plan Your Project" | PASS |
| 36 | Testimonials: next arrow | Shows next testimonial | changed | PASS |
| 37 | Final CTA: Let's Create orb | Opens general project form | modal "Let’s Plan Your Project" | PASS |
| 38 | Final CTA: Book an Event | Opens event form | modal "Book an Event" | PASS |
| 39 | Booking modal: backdrop click | Closes modal | closed | PASS |
| 40 | Footer: service link | Opens service page | /services/event-hall-booking | PASS |
| 41 | Footer: Find your location | Opens location form | modal "Find Your Location" | PASS |
| 42 | Footer: social icons | Only rendered with verified URLs (none configured) | 0 social links rendered | PASS |
| 43 | Form: Continue with no service | Shows validation error, stays on step 1 | Choose the specific service you need. | PASS |
| 44 | Conditional fields: Conference Booking | Attendees + venue requirements + duration shown; no shoot type | Expected number of attendees *(required) / Booking duration / Conference date *(required) / Preferred city / area *(required) / Venue requirements (optional) / Estimated budget (optional) / Project description / requirem | PASS |
| 45 | Form: required fields on Details | Errors for attendees, date, location, description | Enter the expected number of people. | Pick a date, or tick “My date is flexible”. | Enter the preferred city / area. | Tell us a little more (at least 20 characters). | PASS |
| 46 | Form: aria-invalid on errors | Invalid fields flagged for assistive tech | 4 fields aria-invalid | PASS |
| 47 | Conditional fields: Studio Booking (venue) | Duration + capacity + date + area; no attendees/venue needs | What will you shoot? / People on set (capacity) / Booking duration *(required) / Booking date *(required) / Preferred city / area *(required) / Estimated budget (optional) / Project description / requirements *(required) | PASS |
| 48 | Conditional fields: Wedding Photography (shoot) | Shoot type + preferred setting + location; no attendees | Shoot type *(required) / Preferred setting / Shoot date *(required) / Preferred location or venue / Estimated budget (optional) / Project description / requirements *(required) | PASS |
| 49 | Validation: attendees = 0 | Rejects non-positive number | Enter a whole number between 1 and 100,000. | PASS |
| 50 | Form: Details → Contact | Advances when valid | 3Contact | PASS |
| 51 | Validation: bad email/phone + no consent | Specific error messages | Enter a valid email address. | Enter a valid phone number (digits, spaces, +). | Please confirm we may contact you about this request. | PASS |
| 52 | Submit (handler configured) | Loading state, then confirmation with reference | loading=true, ref=BP-261116-C8310B | PASS |
| 53 | Duplicate submission (double-click) | Exactly one request delivered | 1 delivered | PASS |
| 54 | Delivered record structure | Structured JSON with service, contact, schedule, details | service=conference-booking, attendees=180, needs=Stage & AV, date=2027-05-20 | PASS |
| 55 | Success: Done | Closes modal | closed | PASS |
| 56 | Form notice when not configured | Up-front notice with direct contact | banner shown | PASS |
| 57 | Submit (no handler configured) | No success message; fallback email/WhatsApp/phone with data kept | success=false, mailto has body=false, retry=false | PASS |
| 58 | Submit (handler failing (500)) | No success message; fallback email/WhatsApp/phone with data kept | success=false, mailto has body=false, retry=true | PASS |
| 59 | Portfolio card → View service | Opens the related service page | /services/wedding-photography | PASS |
| 60 | Service page: Book This Service | Opens form preselected with the service (Details step) | Book a Shoot / 2Details | PASS |
| 61 | Service page: secondary request (Indoor) | Opens location form | Find Your Location | PASS |
| 62 | Services page: card Book | Opens form for that service | Book an Event | PASS |
| 63 | Services page: card Details | Opens detail page | /services/event-hall-booking | PASS |
| 64 | Contact page: project request form | Inline form rendered (Custom Project) | visible | PASS |
| 65 | Unknown service slug | 404 page with navigation | HTTP 404 | PASS |
| 66 | No-JS fallback: Book a Shoot | Navigates to /book page | /book?type=shoot | PASS |
| 67 | Mobile (dark): menu → Services | Navigates and closes menu | /services, menu closed=true | PASS |
| 68 | Mobile (dark): menu → Book an Event | Opens booking sheet within viewport | title=Book an Event, sheet 390×793, scrollWidth=390 | PASS |
| 69 | Mobile (light): menu → Services | Navigates and closes menu | /services, menu closed=true | PASS |
| 70 | Mobile (light): menu → Book an Event | Opens booking sheet within viewport | title=Book an Event, sheet 390×793, scrollWidth=390 | PASS |
| 71 | Layout dark @390px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 72 | Layout dark @768px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 73 | Layout dark @1024px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 74 | Layout dark @1440px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 75 | Layout light @390px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 76 | Layout light @768px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 77 | Layout light @1024px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 78 | Layout light @1440px (7 pages) | No horizontal overflow; theme applied | ok | PASS |
| 79 | Hero geometry @1440 | Aspect 2023/777, h1 64.8px (4.5vw), content inset 8.4%, REC dot at 94.4% inside the approved scale(1.015) layer | {"w":1440,"h":553.078125,"ratio":2.6036104754640226,"font":"64.8px","contentLeft":120.953125,"contentW":527.15625,"rec":[1369.489990234375,68.54838562011719],"ctaVisible":"1"} | PASS |
| 80 | Hero @768px | Same vertical layout as the approved build | {"sectionH":295,"contentTop":-31,"contentBottom":325} approved top/bottom=-31,325 | PASS |
| 81 | Hero @1024px | Same vertical layout as the approved build | {"sectionH":393,"contentTop":27,"contentBottom":365} approved top/bottom=27,365 | PASS |
| 82 | Hero @1920px | Same vertical layout as the approved build | {"sectionH":737,"contentTop":127,"contentBottom":609} approved top/bottom=127,609 | PASS |
| 83 | Theme toggle (inner page) | Switches to light, persists across reload | light/light → reload light | PASS |
| 84 | Console errors (all runs) | None | 0 | PASS |

## Notes
- "Console errors" excludes the browser's own log lines for the intentional 404/502/503 test responses.
- Hero @768px: content overflows the frame by ~31px top/bottom. This is identical in the approved v2 build (measured with the approved copy) and was kept as-is per the restore-exactly instruction. One-line fix if wanted: change `md:aspect-[2023/777] md:min-h-0` to `lg:aspect-[2023/777] lg:min-h-0` in Hero.tsx.
- Social icons: no verified profile URLs were provided, so no icons are rendered. Set NEXT_PUBLIC_FACEBOOK_URL / NEXT_PUBLIC_INSTAGRAM_URL.
- Not covered: real touch devices, Lighthouse, screen-reader walkthrough, live Resend email delivery (no key available; webhook channel was tested end-to-end).
