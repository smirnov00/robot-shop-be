const MOCK_DATA = [{
	"id": "372ba036-b92b-49bb-b8bd-6ae3550696d2",
	"title": "Ortensia",
	"description": "Developer IV",
	"image": "https://robohash.org/oditaliquidvoluptatem.png?size=500x500&set=set1",
	"count": 5,
	"price": 762.96
}, {
	"id": "a55cf7eb-66ad-440a-8762-8a6ea68da4fe",
	"title": "Celestina",
	"description": "Computer Systems Analyst I",
	"image": "https://robohash.org/errorconsequaturlaborum.png?size=500x500&set=set1",
	"count": 11,
	"price": 1707.05
}, {
	"id": "83be01c6-249b-4bfc-9e65-5d46d5e3efa4",
	"title": "Geraldine",
	"description": "Web Developer II",
	"image": "https://robohash.org/quisaliquidtempore.png?size=500x500&set=set1",
	"count": 3,
	"price": 992.47
}, {
	"id": "af6b66f3-2816-4d4d-82e2-e972c4c975e7",
	"title": "Kathlin",
	"description": "Environmental Specialist",
	"image": "https://robohash.org/sitducimusmolestiae.png?size=500x500&set=set1",
	"count": 10,
	"price": 616.28
}, {
	"id": "6c1fcbbf-bff2-44d5-97e0-002713688120",
	"title": "Kakalina",
	"description": "Compensation Analyst",
	"image": "https://robohash.org/etetquas.png?size=500x500&set=set1",
	"count": 13,
	"price": 745.62
}, {
	"id": "9b25bfaf-262e-435e-87a7-51f124ff4360",
	"title": "Anitra",
	"description": "Human Resources Manager",
	"image": "https://robohash.org/beataeinsed.png?size=500x500&set=set1",
	"count": 6,
	"price": 1805.63
}, {
	"id": "7cdf77d4-40b8-4418-b967-99f3c274da8b",
	"title": "Ellerey",
	"description": "Recruiter",
	"image": "https://robohash.org/voluptasnihilqui.png?size=500x500&set=set1",
	"count": 7,
	"price": 1731.85
}, {
	"id": "d39af479-5f8c-419a-9037-6119d6334292",
	"title": "Broderic",
	"description": "Geological Engineer",
	"image": "https://robohash.org/fugaestanimi.png?size=500x500&set=set1",
	"count": 5,
	"price": 1807.02
}, {
	"id": "fd14a1d5-d897-40af-a4bf-2f137a8d8f07",
	"title": "Marsiella",
	"description": "Systems Administrator IV",
	"image": "https://robohash.org/mollitiaquaerepellat.png?size=500x500&set=set1",
	"count": 2,
	"price": 1020.33
}, {
	"id": "19fc7379-75d9-42c0-a985-8cdd256c6763",
	"title": "Vinnie",
	"description": "Editor",
	"image": "https://robohash.org/estnemoqui.png?size=500x500&set=set1",
	"count": 4,
	"price": 1618.32
}, {
	"id": "286413f6-9ab8-40c5-b4f8-6537a3537de7",
	"title": "Benjy",
	"description": "Paralegal",
	"image": "https://robohash.org/eumquout.png?size=500x500&set=set1",
	"count": 15,
	"price": 1549.73
}, {
	"id": "15d2cc3e-fd5e-464a-9367-197fec14ae3b",
	"title": "Rena",
	"description": "Physical Therapy Assistant",
	"image": "https://robohash.org/dolorestenetureos.png?size=500x500&set=set1",
	"count": 11,
	"price": 1375.89
}, {
	"id": "ce781590-7cd9-47ff-86fb-e47c065b2f18",
	"title": "Saundra",
	"description": "Staff Scientist",
	"image": "https://robohash.org/doloresuntest.png?size=500x500&set=set1",
	"count": 3,
	"price": 1565.45
}, {
	"id": "dd73d5d0-585f-4ec1-a58a-aef9ee0017d9",
	"title": "Aubert",
	"description": "Speech Pathologist",
	"image": "https://robohash.org/deseruntutfacere.png?size=500x500&set=set1",
	"count": 11,
	"price": 1252.89
}, {
	"id": "2bc09d34-37f1-43b2-804f-ba05a1a9a034",
	"title": "Britni",
	"description": "Actuary",
	"image": "https://robohash.org/veniamassumendafacilis.png?size=500x500&set=set1",
	"count": 3,
	"price": 563.71
}, {
	"id": "2c65ea3b-21a3-4503-9f55-f8deec4a8f55",
	"title": "Shandee",
	"description": "Analyst Programmer",
	"image": "https://robohash.org/enimreiciendisdolore.png?size=500x500&set=set1",
	"count": 8,
	"price": 1035.09
}];

export const findAll = () => {
  return MOCK_DATA;
};

export const findOneById = (productId) => {
  return MOCK_DATA.find(({ id }) => productId === id);
}
