import csv
import dash
import dash_cytoscape as cyto
# import dash_html_components as html
from dash import html
from dash.dependencies import Input, Output, State
# import dash_core_components as dcc
from dash import dcc

app = dash.Dash(__name__)

styles = {
    'pre': {
        'border': 'thin lightgrey solid',
        'overflowX': 'scroll'
    }
}

edge_list = []
node_list = []
with open('reaction_map.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # print(row)
        node_list.append(row['\ufeffSource'])
        if row['End'] not in node_list:
            node_list.append(row['End'])
        source_target_label = tuple(
            (row['\ufeffSource'], row['End'], row['Label']))
        edge_list.append(source_target_label)

nodes = [
    {
        'data': {'id': label, 'label': label}
    }
    for label in (
        node_list
    )
]

edges = [
    {'data': {'id': source+'--'+target+'--'+label, 'source': source,
              'target': target, 'label': label}}
    for source, target, label in (
        edge_list
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

cyto.load_extra_layouts()

app.layout = html.Div(
    children=[
        cyto.Cytoscape(
            id='cytoscape-event-callbacks-2',
            layout={'name': 'cola', 'nodeSpacing': 70},
            style={'width': '100vw', 'height': '100vh'},
            stylesheet=default_stylesheet,
            elements=elements,
            # mouseoverEdgeData=edges
        ),
        html.P(id='cytoscape-tapNodeData-output'),
        html.P(id='cytoscape-tapEdgeData-output'),
        html.P(id='cytoscape-mouseoverNodeData-output'),
        html.P(id='cytoscape-mouseoverEdgeData-output')
    ],
)


@app.callback(Output('cytoscape-tapNodeData-output', 'children'),
              Input('cytoscape-event-callbacks-2', 'tapNodeData'))
def displayTapNodeData(data):
    if data:
        return "You recently clicked/tapped the city: " + data['label']


@app.callback(Output('cytoscape-tapEdgeData-output', 'children'),
              Input('cytoscape-event-callbacks-2', 'tapEdgeData'))
def displayTapEdgeData(data):
    if data:
        return "You recently clicked/tapped the edge between " + \
               data['source'].upper() + " and " + data['target'].upper()


@app.callback(Output('cytoscape-mouseoverNodeData-output', 'children'),
              Input('cytoscape-event-callbacks-2', 'mouseoverNodeData'))
def displayTapNodeData(data):
    if data:
        return "You recently hovered over the city: " + data['label']


@app.callback(Output('cytoscape-mouseoverEdgeData-output', 'children'),
              Input('cytoscape-event-callbacks-2', 'mouseoverEdgeData'))
def displayTapEdgeData(data):
    if data:
        return "You recently hovered over the edge between " + \
               data['source'].upper() + " and " + data['target'].upper()


if __name__ == '__main__':
    app.run_server(debug=True)
