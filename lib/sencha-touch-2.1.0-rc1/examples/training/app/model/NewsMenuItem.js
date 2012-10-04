Ext.define("CrimeFinder.model.NewsMenuItem", {
  extend: 'Ext.data.Model',
  config: {
  idProperty: 'id',
  fields: [
    "label", "store", "view", "url",
    {
		name : "id",
		type : 'int'
	}
  ]
  }
})