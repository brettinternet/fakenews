INSERT INTO articles (
  published,
  authorid,
  city,
  state,
  countryid,
  title,
  img,
  imgnail,
  imgdesc,
  headline,
  content,
  createdat,
  categoryid,
  breakingnews
) VALUES (
  $1, --published
  (SELECT id FROM authors WHERE categoryid = (SELECT id FROM categories WHERE upper(category) = upper($13)) OFFSET floor(random()*(2)) LIMIT 1),
  $2, --city
  $3, --state
  (SELECT	id FROM countries WHERE upper(twoletter) = upper($4)),
  $5, --title
  $6, --img
  $7, --imgnail
  $8, --imgdesc
  $9, --headline
  $10, --content
  $11, --createdat
  (SELECT id FROM categories WHERE upper(category) = upper($12)),
  $13 --breakingnews
);

-- "published":"",
-- "city":"",
-- "state":"",
-- "country":"",
-- "title":"",
-- "img":"",
-- "imgnail":"",
-- "imgdesc":"",
-- "headline":"",
-- "content":"",
-- "createdat":"",
-- "category":"",
-- "breakingnews":""
-- {
-- 	"published":"false",
-- 	"city":"New York",
-- 	"state":"NY",
-- 	"country":"us",
-- 	"title":"Wow this is unbelieveable",
-- 	"img":"https://i.imgur.com/OBXukWT.jpg",
-- 	"imgnail":"https://i.imgur.com/OBXukWT.jpg",
-- 	"imgdesc":"This is a cool wolf.",
-- 	"headline":"Healiner here, interesting stuff.",
-- 	"content":"This is the article. Articles are in complete sentences. Wow.",
-- 	"createdat":"",
-- 	"category":"science",
-- 	"breakingnews":"false"
-- }
