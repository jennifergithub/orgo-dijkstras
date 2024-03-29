import json

import dash
import dash_cytoscape as cyto
import dash_html_components as html
import dash_core_components as dcc
from dash.dependencies import Input, Output
import csv
import networkx as nx

app = dash.Dash(__name__)

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


# styles = {
#     'pre': {
#         'border': 'thin lightgrey solid',
#         'overflowX': 'scroll'
#     }
# }

# print(node_list)
# for node in node_list:
#     print([n for n in G.predecessors(node)])
# print(edge_list)
print(len(node_list))
# app.get_asset_url('ketone.png')

node_images = ['./assets/acid_chloride.png',
               './assets/primary_alcohol.png',
               './assets/keton3.png',
               './assets/tert_alcohol.png',
               './assets/acid_azide.png',
               './assets/amine_prim.png',
               './assets/sec_amide.png',
               './assets/tert_amide.png', './assets/prim_amide.png', './assets/carb_acid.png', './assets/alde.png', './assets/est.png', './assets/cyanohy.png', './assets/anhydride.png', './assets/nitrile1.png', './assets/alkylazide1.png', './assets/ammoniumsalt1.png', './assets/quatammoniumsalt2.png', './assets/sec_amine.png', './assets/tert_amine2.png', './assets/phosge.png', './assets/urea1.png', './assets/chloroform.png', './assets/carbamate.png', './assets/benzen.png', './assets/chlorobenzen.png', './assets/nitrobenzen.png', './assets/aniline1.png', './assets/alkylbenzene.png', './assets/benzoicacid.png', './assets/alkylhalide.png', './assets/isocya.png', './assets/alkene.png', './assets/carboxylate.png', './assets/sec_alcohol.png', './assets/oxime.png', './assets/iminium1.png', './assets/amine_4.png', './assets/hydrazone1.png', './assets/enamine.png', './assets/imine1.png', './assets/alkylhalide.png', './assets/grignard.png', './assets/carbonate.png', './assets/alphahaloketone1.png', './assets/alphahalohalide.png', './assets/alphahalocarboacid1.png', './assets/methylketone.png', './assets/haloform.png']

# print(node_list)
zipped_node_list = [list(l) for l in zip(node_list, node_images)]

nodes = [
    {
        'classes': 'images',
        'data': {'id': label, 'label': label, 'predecessor': predecessor, 'url': url}
    }
    # 'predecessors': predecessors
    for label, url in (
        # ['Ketone', './assets/ketone.png'],
        # ['1° Alcohol', './assets/primary_alc1.png'],
        # ['Acid chloride', './assets/primary_alc1.png'],
        # ['3° Alcohol', './assets/ketone.png'],
        # ['Acyl azide', './assets/ketone.png']
        zipped_node_list
    )
    # for url in (
    #     node_images
    # )
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
            'label': 'data(label)',
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
            'background-position': 'center',
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
