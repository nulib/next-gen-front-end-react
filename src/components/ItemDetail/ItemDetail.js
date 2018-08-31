import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TabContent from './TabContent';

const ItemDetail = props => {
  if (!props.item) {
    return [];
  }

  const {
    title: { primary: [title] } = '',
    title: { alternate: [alternate] } = '',
    abstract: [abstract] = '',
    caption: [caption] = '',
    contributor = null,
    date: [date] = '',
    description: [description] = '',
    admin_set: { title: [admin_set] } = '', // division
    identifier = null,
    license = null,
    nul_use_statement = '',
    keyword = '',
    language = null,
    location = null,
    permalink = '',
    provenance: [provenance] = '',
    publisher = '',
    related_url = null,
    rights_holder = '',
    source = '',
    subject = '',
    rights_statement: { label: rights_statement_text } = null,
    genre = null,
    physical_description: { material } = null,
    physical_description: { size } = null,
    style_period = null,
    technique = null,
    accession_number = '',
    box: { name: box_name } = null,
    box: { number: box_number } = null,
    folder: { name: folder_name } = null,
    folder: { number: folder_number } = null,
    call_number = '',
    catalog_key = '',
    bibliographic_citation = ''
  } = props.item;

  const metadataPanel = [
    { label: 'Title', value: title },
    { label: 'Alternate Title', value: alternate },
    { label: 'Abstract', value: abstract },
    { label: 'Caption', value: caption },
    { label: 'Contributor', value: contributor, facet_value: 'Contributor' },
    { label: 'Date', value: date, facet_value: 'Date' },
    { label: 'Description', value: description },
    { label: 'Division', value: admin_set, facet_value: 'admin_set' },
    { label: 'Keyword', value: keyword, facet_value: 'Keyword' },
    { label: 'Language', value: language, facet_value: 'Language' },
    { label: 'Location', value: location, facet_value: 'Location' },
    { label: 'Provenance', value: provenance },
    { label: 'Publisher', value: publisher, facet_value: 'Publisher' },
    { label: 'Related Url', value: related_url, facet_value: 'related_url' },
    {
      label: 'Rights Holder',
      value: rights_holder,
      facet_value: 'rights_holder'
    },
    { label: 'Source', value: source, facet_value: 'source' },
    { label: 'Subject', value: subject, facet_value: 'subject' },
    { label: 'Rights Statement', value: rights_statement_text },
    { label: 'Genre', value: genre, facet_value: 'genre' },
    {
      label: 'Physical Description material',
      value: material,
      facet_value: 'physical_description'
    },
    {
      label: 'Physical Description size',
      value: size,
      facet_value: 'physical_description'
    },
    { label: 'Style Period', value: style_period, facet_value: 'style_period' },
    { label: 'Technique', value: technique, facet_value: 'technique' }
  ];

  const findThisItemPanel = [
    { label: 'Accession', value: accession_number },
    { label: 'Box Name', value: box_name, facet_value: 'box_name' },
    { label: 'Box Number', value: box_number, facet_value: 'box_number' },
    { label: 'Folder Name', value: folder_name, facet_value: 'folder_name' },
    {
      label: 'Folder Number',
      value: folder_number,
      facet_value: 'folder_number'
    },
    { label: 'Call Number', value: call_number },
    { label: 'Catalog Key', value: catalog_key },
    { label: 'Citation', value: bibliographic_citation }
  ];

  let formatMLA = `${title} here's the rest MLA`;
  let formatChicago = `${title} chicago format`;
  let formatAPA = `${title} apa format`;
  let formatWikipedia = `${title} wikipedia format`;

  const citePanel = [
    { label: 'Title', value: title },
    { label: 'Permalink', value: permalink },
    { label: 'Identifier', value: identifier },
    { label: 'Licenses', value: license, facet_value: 'License' },
    { label: 'Use Statement', value: nul_use_statement }
  ];

  const citationFormats = [
    { label: 'MLA Format', value: formatMLA },
    { label: 'Chicago/Turabian Format', value: formatChicago },
    { label: 'APA Format', value: formatAPA },
    { label: 'Wikipedia Citation', value: formatWikipedia }
  ];

  return (
    <section className="item-section contain-970 item-categories-wrapper">
      <Tabs selectedTabClassName="active" id="tab-container">
        <TabList id="tabs" role="tablist">
          <Tab role="tab" data-tab-id="about">
            About this Item
          </Tab>
          <Tab role="tab" data-tab-id="find">
            Find this Item
          </Tab>
          <Tab role="tab" data-tab-id="cite">
            Cite this Item
          </Tab>
        </TabList>

        <div id="tab-content">
          <TabPanel>
            <TabContent items={metadataPanel} />
          </TabPanel>
          <TabPanel>
            <TabContent items={findThisItemPanel} />
          </TabPanel>
          <TabPanel>
            <div className="cite-group-col">
              <div className="cite-group">
                <TabContent items={citePanel} />
              </div>
            </div>
            <div className="cite-group-col">
              <div className="cite-group">
                <TabContent items={citationFormats} />
              </div>
            </div>
          </TabPanel>
        </div>
      </Tabs>
    </section>
  );
};

export default ItemDetail;
