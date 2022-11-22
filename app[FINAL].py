import json

import dash
import dash_cytoscape as cyto
import dash_html_components as html
import dash_core_components as dcc
from dash.dependencies import Input, Output
import csv
import networkx as nx

app = dash.Dash(__name__)
server = app.server

edge_list = []
nx_edge_list = []
node_list = []
with open('reaction_map.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # print(row)
        source = row['\ufeffSource']
        target = row['End']
        label = row['Label']
        if source not in node_list:
            node_list.append(source)
        if target not in node_list:
            node_list.append(target)
        source_target_label = tuple(
            (source, target, label))
        edge_for_nx = [source, target]
        nx_edge_list.append(edge_for_nx)
        edge_list.append(source_target_label)

# create NetworkX object for shortest path
G = nx.DiGraph()
G.add_nodes_from(node_list)
G.add_edges_from(nx_edge_list)
predecessor_dict = {}
for node in G.nodes:
    predecessor_dict[node] = [n for n in G.predecessors(node)]
# print(G.nodes)
predecessor_list = list(predecessor_dict.values())
new_list = []
for predecessor in predecessor_list:
    new_list.append(','.join(predecessor))
# print(new_list)
# p = nx.shortest_path(G, source='1° Alcohol', target='1° Amine')
# print(p)


styles = {
    'pre': {
        'border': 'thin lightgrey solid',
        'overflowX': 'scroll'
    }
}

# print(node_list)
# for node in node_list:
#     print([n for n in G.predecessors(node)])
# print(edge_list)
node_images = ['https://orgosynthesissolver.s3.amazonaws.com/assets/acid_chloride.png',
               'https://orgosynthesissolver.s3.amazonaws.com/assets/primary_alcohol.png',
               'https://orgosynthesissolver.s3.amazonaws.com/assets/keton3.png',
               'https://orgosynthesissolver.s3.amazonaws.com/assets/tert_alcohol.png',
               'https://orgosynthesissolver.s3.amazonaws.com/assets/acid_azide.png',
               'https://orgosynthesissolver.s3.amazonaws.com/assets/amine_prim.png',
               'https://orgosynthesissolver.s3.amazonaws.com/assets/sec_amide.png',
               'https://orgosynthesissolver.s3.amazonaws.com/assets/tert_amide.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/prim_amide.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/carb_acid.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alde.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/est.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/cyanohy.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/anhydride.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/nitrile1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alkylazide1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/ammoniumsalt1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/quatammoniumsalt2.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/sec_amine.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/tert_amine2.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/phosge.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/urea1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/chloroform.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/carbamate.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/benzen.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/chlorobenzen.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/nitrobenzen.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/aniline1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alkylbenzene.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/benzoicacid.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alkylhalide.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/isocya.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alkene.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/carboxylate.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/sec_alcohol.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/oxime.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/iminium1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/amine_4.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/hydrazone1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/enamine.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/imine1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alkylhalide.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/grignard.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/carbonate.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alphahaloketone1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alphahalohalide.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/alphahalocarboacid1.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/methylketone.png', 'https://orgosynthesissolver.s3.amazonaws.com/assets/haloform.png']

zipped_node_list = [list(l) for l in zip(node_list, node_images)]

nodes = [
    {'classes': 'images',
        'data': {'id': label, 'label': label, 'predecessor': predecessor, 'url': url}
     }
    # 'predecessors': predecessors
    # for label in (
    #     node_list
    # )
    for label, url in (
        zipped_node_list
    )
    for predecessor in (
        new_list
    )
]

# print(nodes)

edges = [
    {'data': {'id': source+'--'+target+'--'+label, 'source': source,
              'target': target, 'label': label}}
    for source, target, label in (
        edge_list
    )
]

default_stylesheet = [
    {
        'selector': 'node',
        'style': {
            'background-color': '#BFD7B5',
            'label': 'data(label)'
        }
    },
    {
        'selector': 'edge',
        'style': {
            'curve-style': 'bezier',
            'width': '2px',
            # 'label': 'data(label)',
            'font-size': '10px',
            'font-opacity': 1,
            'target-arrow-color': 'black',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 2,
            'line-color': 'green'
        }
    },
    {
        'selector': ':selected',
        'style': {
            'border-color': 'black',
            'border-opacity': '1',
            'border-width': '0.075px',
            'label': 'data(label)'
        }
    },
    {
        'selector': '.images',
        'style': {
            'width': 120,
            'height': 80,
            'background-fit': 'cover',
            'background-image': 'data(url)'
        }
    }
]

cyto.load_extra_layouts()

app.layout = html.Div([
    cyto.Cytoscape(
        id='cytoscape-event-callbacks-2',
        layout={'name': 'cose', 'nodeSpacing': 100},
        elements=edges+nodes,
        stylesheet=default_stylesheet,
        style={'width': '100%', 'height': '450px'}
    ),
    # html.P(id='cytoscape-tapNodeData-output'),
    # html.P(id='cytoscape-tapEdgeData-output'),
    html.P(id='cytoscape-mouseoverNodeData-output'),
    html.P(id='cytoscape-mouseoverEdgeData-output')
])


# @app.callback(Output('cytoscape-tapNodeData-output', 'children'),
#               Input('cytoscape-event-callbacks-2', 'tapNodeData'))
# def displayTapNodeData(data):
#     if data:
#         return "You recently clicked/tapped the node: " + data['label']


# @app.callback(Output('cytoscape-tapEdgeData-output', 'children'),
#               Input('cytoscape-event-callbacks-2', 'tapEdgeData'))
# def displayTapEdgeData(data):
#     if data:
#         return "Use " + data['label'] + " to get from " + \
#                data['source'].upper() + " to " + data['target'].upper()


@app.callback(Output('cytoscape-mouseoverNodeData-output', 'children'),
              Input('cytoscape-event-callbacks-2', 'mouseoverNodeData'))
def displayTapNodeData(data):
    if data:
        return "How to get here: " + str(predecessor_dict[data['label']])


@app.callback(Output('cytoscape-mouseoverEdgeData-output', 'children'),
              Input('cytoscape-event-callbacks-2', 'mouseoverEdgeData'))
def displayTapEdgeData(data):
    if data:
        return "Use " + data['label'] + " to get from " + \
               data['source'].upper() + " to " + data['target'].upper()


if __name__ == '__main__':
    app.run_server(debug=True)
