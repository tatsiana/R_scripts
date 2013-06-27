from django.http import HttpResponse
from django.template import loader,RequestContext
from fireapp.models import DatabyState
from fireapp.models import DataByCounty
import simplejson as json

def home(request):
    databystate = DatabyState.objects.all()
    firedatabystate ={}
    for fire in databystate:
        value = "\"fires\" : " + str(fire.fires) + ",\"major\" : " +str(fire.major)\
        +",\"strucfires\" : "+ str(fire.strucfires)\
        +",\"otherfires\" : "+ str(fire.otherfires)\
        +",\"nonresstrucfires\" : "+ str(fire.nonresstrucfires)\
        +",\"vehfires\" : "+str(fire.vehfires)\
        +",\"outsidefires\" : "+str(fire.outsidefires)\
        +",\"resstrucfires\" : "+str(fire.resstrucfires)\
        +",\"cause_intfires\" : "+str(fire.cause_intfires)\
        +",\"cause_smokinfires\" : "+str(fire.cause_smokingfires)\
        +",\"cause_heatingfires\" : "+str(fire.cause_heatingfires)\
        +",\"cause_cookingfires\" : "+str(fire.cause_cookingfires)
        firedatabystate[fire.state]= value
    template = loader.get_template('zip.html')
    result = json.dumps(firedatabystate)
    #context = RequestContext(request, {
    #    'firedatabystate': firedatabystate,
    context = RequestContext(request, {
        'result': result,
    })
    return HttpResponse(template.render(context))
   
    #output = ', '.join([p.question for p in latest_poll_list])

def index(request):
    databycounty = DataByCounty.objects.all()
    firedatabycounty ={}
    for fire in databycounty:
        value = "\"fires\" : " + str(fire.fires)
        firedatabycounty[fire.fips_id]= value
    template = loader.get_template('zip.html')
    result = json.dumps(firedatabycounty)
    context = RequestContext(request, {
        'result': result,
    })
    return HttpResponse(template.render(context))
   
    #output = ', '.join([p.question for p in latest_poll_list])
    
