/* globals expect, test */
/* eslint-disable no-param-reassign */

import { SymbolMaster, Text, Artboard, Document } from '../../'

function createSymbolMaster(document) {
  const artboard = new Artboard({
    name: 'Test',
    parent: document.selectedPage,
  })
  const text = new Text({
    text: 'Test value',
    parent: artboard,
  })

  // build the symbol master
  return {
    master: SymbolMaster.fromArtboard(artboard),
    text,
    artboard,
  }
}

test('should create a symbol master from an artboard', (context, document) => {
  // build the symbol master
  const { master } = createSymbolMaster(document)
  expect(master.type).toBe('SymbolMaster')
})

test('should create a symbol instance from a master', (context, document) => {
  // build the symbol master
  const { master } = createSymbolMaster(document)

  expect(master.getAllInstances()).toEqual([])

  // create an instance
  const instance = master.createNewInstance()
  expect(instance.type).toBe('SymbolInstance')
  // by default, it's not anywhere in the document
  expect(master.getAllInstances()).toEqual([])

  // add the instance to the page
  document.selectedPage.layers = document.selectedPage.layers.concat(instance)
  expect(document.selectedPage.layers).toEqual([instance])
})

test('should have overrides', context => {
  const document = Document.fromNative(context.document)

  const { master, text } = createSymbolMaster(document)
  const instance = master.createNewInstance()
  document.selectedPage.layers = document.selectedPage.layers.concat(instance)

  expect(instance.overrides.length).toBe(1)
  const override = instance.overrides[0]
  expect(override.toJSON()).toEqual({
    id: `${text.id}_stringValue`,
    path: text.id,
    property: 'stringValue',
    symbolOverride: false,
    value: 'Test value',
    isDefault: true,
  })
})

test('should be able to set overrides', context => {
  const document = Document.fromNative(context.document)

  const { master, text } = createSymbolMaster(document)
  const instance = master.createNewInstance()
  document.selectedPage.layers = document.selectedPage.layers.concat(instance)

  expect(instance.overrides.length).toBe(1)
  const override = instance.overrides[0]
  override.value = 'overridden'

  expect(instance.overrides.length).toBe(1)
  expect(instance.overrides[0]).toEqual({
    id: `${text.id}_stringValue`,
    path: text.id,
    property: 'stringValue',
    symbolOverride: false,
    value: 'overridden',
    isDefault: false,
  })
})