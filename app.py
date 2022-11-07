import dash
import dash_cytoscape as cyto
# import dash_html_components as html
from dash import html

app = dash.Dash(__name__)

nodes = [
    {
        'data': {'id': name, 'label': label}
    }
    for name, label in (
        ('Acid chloride', 'Acid chloride'),
        ('Ketone', 'Ketone'),
        ('Aldehyde', 'Aldehyde'),
        ('Ester', 'Ester'),
        ('Anhydride', 'Anhydride'),
        ('Carboxylic acid', 'Carboxylic acid'),
        ('Cyanohydrin', 'Cyanohydrin'),
        ('1° Alcohol', '1° Alcohol'),
        ('2° Alcohol', '2° Alcohol'),
        ('3° Alcohol', '3° Alcohol'),
        ('1° Amide', '1° Amide'),
        ('2° Amide', '2° Amide'),
        ('3° Amide', '3° Amide'),
        ('Acyl azide', 'Acyl azide')
    )
]

edges = [
    {'data': {'id': source+'--'+target+'--'+label, 'source': source,
              'target': target, 'label': label}}
    for source, target, label in (
        ('Acid chloride', '1° Alcohol', 'LAH, H2O'),
        ('Acid chloride', 'Ketone', 'Cuprate'),
        ('Acid chloride', '3° Alcohol', 'Cuprate'),
        ('Acid chloride', 'Acyl azide', 'NaN3'),
        ('Acid chloride', '1° Amide', 'NH3'),
        ('Acid chloride', '3° Amide', 'R2NH'),
        ('Acid chloride', '2° Amide', 'RNH2'),
        ('Acid chloride', 'Carboxylic acid', 'H2O, py'),
        ('Acid chloride', 'Aldehyde', 'LiAlH(tBuO)3, H3O+'),
        ('Acid chloride', 'Ester', '1° Alcohol'),
        ('Acid chloride', 'Ester', '2° Alcohol'),
        ('Acid chloride', 'Ester', '3° Alcohol'),
        ('Aldehyde', 'Carboxylic acid', 'Ag2O'),
        ('Aldehyde', 'Carboxylic acid', 'MCPBA'),
        ('Aldehyde', 'Cyanohydrin', 'HCN'),
        ('Ester', 'Aldehyde', 'DIBAL-H, H3O+'),
        ('Ester', 'Carboxylic acid', 'aq. Acid or base'),
        ('Ester', '1° Alcohol', 'LAH, H2O'),
        ('Anhydride', 'Carboxylic acid', 'H2O, py'),
        ('Anhydride', '1° Amide', 'NH3')
    )
]

elements = nodes + edges

default_stylesheet = [
    {
        'selector': 'node',
        'style': {
            'width': 'data(size)',
            'height': 'data(size)',
            'content': 'data(label)',
            'font-size': '10px',
            'color': 'black',
            'background-color': 'data(color)'
        }
    },
    {
        'selector': 'edge',
        'style': {
            'curve-style': 'bezier',
            'width': '2px',
            'label': 'data(label)',
            'font-size': '10px',
            'font-opacity': 1,
            'target-arrow-color': 'black',
            'target-arrow-shape': 'triangle',
            'line-color': 'green'
        }
    },
    {
        'selector': ':selected',
        'style': {
            'border-color': 'black',
            'border-opacity': '1',
            'border-width': '0.075px'
        }
    }
]

app.layout = html.Div(
    children=[
        cyto.Cytoscape(
            id='output_graph',
            layout={'name': 'cose'},
            style={'width': '100vw', 'height': '100vh'},
            stylesheet=default_stylesheet,
            elements=elements
        )
    ],
    style={'position': 'fixed', 'zIndex': '1', 'width': '99vw', 'height': '99vh'})


if __name__ == '__main__':
    app.run_server(debug=True)
