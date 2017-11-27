<div id="modalGas" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
	<div class="modal-inside">
		<!-- Content -->
		<div id="pricing-table" class="clearfix">
			<div class="features left">
				<ol>
					<li class="title">&nbsp;</li>
					<!-- providers -->
					<li class="provider">{{title}}</li>
					<!-- legend -->
					<li class="legend">&nbsp;</li>
					<!-- energiekost -->
					<li class="parent parent-toggle parent-1" ng-click="openSection('parent-1-sub')">
						<p translate>Energiekost</p>
					    <ul class="sub parent-1-sub">
					        <li ng-if="best_product.abonnement_meter"><a href="" translate>Abonnement</a></li>
					        <li ng-if="best_product.abonnement"><a href="" translate>Abonnement</a></li>
					        <li ng-if="best_product.variabele_kost_dag"><a href="" translate>Verbruik dag</a></li>
					        <li ng-if="best_product.variabele_kost_nacht"><a href="" translate>Verbruik nacht</a></li>
					        <li ng-if="best_product.variabele_kost_excl_nacht"><a href="" translate>Verbruik excl_nacht</a></li>
					        <li ng-if="best_product.variabel_gas"><a href="" translate>Verbruik</a></li>
					        <li ng-if="markup_green && best_product.markup_green"><a href="" translate>Extra kost groene stroom</a></li>
					        <li ng-if="best_product.cost_green"><a href="" translate>Kosten voor groene stroom</a></li>
					        <li ng-if="best_product.cost_wkk"><a href="" translate>WKK</a></li>
					    </ul>
					</li>
					<!-- nettarieven -->
					<li class="parent parent-toggle parent-2" ng-click="openSection('parent-2-sub')">
						<p translate>Nettarieven</p>
					    <ul class="sub parent-2-sub">
					        <li><a href="" translate>Distributie</a></li>
					        <li ng-if="best_product.prosumer_cost"><a href="" translate>Prosumententarief</a> </li>
					        <li><a href="" translate>Transmissie</a></li>
					    </ul>
					</li>
					<!-- heffingen -->
					<li class="parent parent-toggle parent-3" ng-click="openSection('parent-3-sub')">
						<p translate>Heffingen</p>
					    <ul class="sub parent-3-sub">
					        <li><a href="" translate>Bijdrage op energie</a></li>
					        <li><a href="" translate>Federale bijdrage</a></li>
					        <li ng-if="best_product.fund_cost"><a href="" translate>Bijdrage energiefonds</a></li>
							<li ng-if="best_product.turtle_tax"><a href="" translate>Energieheffing</a></li>
							<li ng-if="best_product.openbare_dienstverlening"><a href="" translate>Openbare Dienstverlening</a></li>
					    </ul>
					</li>
					<!-- totaal -->
					<li class="parent parent-result parent-4" >
						<p translate>totaal</p>
					</li>
					<!-- vreg 
					<li class="parent-section parent-result parent-8">
						<p><?php echo _("Dezelfde berekening door uw energieregulator") ?></p>
					</li>-->
					<!-- kortingen -->
					<li class="parent parent-toggle parent-5 discount" ng-click="openSection('parent-5-sub')">
						<p translate>Kortingen</p>
					    <ul class="sub parent-5-sub">
					        <li ng-if="best_product.korting_in_EUR || (your_product && your_product.korting_in_EUR)"><a href="" translate>Welkomstkorting</a></li>
					        <li ng-if="best_product.korting_in_ckWh || (your_product && your_product.korting_in_ckWh)"><a href="" translate>Korting in c/kWh</a></li>
					        <li ng-if="best_product.korting_in_prokWh || (your_product && your_product.korting_in_prokWh)"><a href="" translate>Korting in % kWh</a></li>
							<li ng-if="best_product.korting_day_night || (your_product && your_product.korting_day_night)"><a href="" translate>Korting dag/nacht in Euro</a></li>
					    </ul>
					</li>
					<!-- totaal na discount -->
					<li class="parent parent-result parent-6">
						<p><span class="text-span" translate>Totaal</span><span class="text-span">&nbsp;</span><span translate>na kortingen</span></p>
					</li>
					<!-- uw besparing -->
					<li class="parent parent-result parent-7" ng-show="your_product">
						<p translate>Uw besparing</p>
					</li>
				</ol>		
				<!-- tariefkaarten 
				<ol>
					<li class="parent-section parent-result parent-9">
						<p>Tariefkaarten</p>
					</li>							
				</ol>
				-->		
			</div>
			<div class="current-contract left" ng-show="your_product">
				<ol>
					<li class="title">Your product</li>
					<!-- providers -->
					<li class="provider clearfix">
						<img class="left" ng-src="/images/providers/{{your_product._provider}}-logo.png" alt="{{your_product._product}}" />
						<b class="left">{{your_product._product}}</b>
					</li>
					<!-- legend -->
					<li class="legend clearfix"><span class="mc">c/kWh</span><span class="mc">kWh</span><span translate>Prijs</span></li>
					<!-- energiekost -->
					<li class="parent parent-toggle parent-1">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.total_energy._value ? your_product.total_energy._value : "&nbsp;"}}</span></p>
					    <ul class="sub parent-1-sub">
					        <li ng-if="your_product.abonnement" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.abonnement._value ? your_product.abonnement._value : "&nbsp;"}}</span></li>
					        <li ng-if="your_product.abonnement_meter" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.abonnement_meter._value ? your_product.abonnement_meter._value : "&nbsp;"}}</span></li>
						<li ng-if="your_product.variabel_gas" class="clearfix"><span class="mc">{{ your_product.variabel_gas._unit_cost  }}</span><span class="mc">{{ your_product.variabel_gas._units }}</span><span>{{ your_product.variabel_gas._value }}</span></li>
						<li ng-if="your_product.variabele_kost_dag" class="clearfix"><span class="mc">{{ your_product.variabele_kost_dag._unit_cost  }}</span><span class="mc">{{ your_product.variabele_kost_dag._units }}</span><span>{{ your_product.variabele_kost_dag._value }}</span></li>
						<li ng-if="your_product.variabele_kost_nacht" class="clearfix"><span class="mc">{{ your_product.variabele_kost_nacht._unit_cost  }}</span><span class="mc">{{ your_product.variabele_kost_nacht._units }}</span><span>{{ your_product.variabele_kost_nacht._value }}</span></li>
						<li ng-if="your_product.variabele_kost_excl_nacht" class="clearfix"><span class="mc">{{ your_product.variabele_kost_excl_nacht._unit_cost  }}</span><span class="mc">{{ your_product.variabele_kost_excl_nacht._units }}</span><span>{{ your_product.variabele_kost_excl_nacht._value }}</span></li>
						<li ng-if="markup_green && best_product.markup_green" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>&nbsp;</span></li>
						<li ng-if="your_product.cost_green" class="clearfix"><span class="mc">{{ your_product.cost_green._unit_cost  }}</span><span class="mc">{{ your_product.cost_green._units }}</span><span>{{ your_product.cost_green._value }}</span></li>
						<li ng-if="your_product.cost_wkk" class="clearfix"><span class="mc">{{ your_product.cost_wkk._unit_cost  }}</span><span class="mc">{{ your_product.cost_wkk._units }}</span><span>{{ your_product.cost_wkk._value }}</span></li>
					    </ul>
					</li>
					<!-- nettarieven -->
					<li class="parent parent-toggle parent-2">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.net_tariff._value*1 + (your_product.prosumer_cost? 0*count*your_product.prosumer_cost._unit_cost:0) | number : 2}}</span></p>
					    <ul class="sub parent-2-sub">
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.distribution_cost._value ? your_product.distribution_cost._value : "&nbsp;"}}</span></li>
						<li ng-if="your_product.prosumer_cost" class="clearfix"><span class="mc">&nbsp;{{ your_product.prosumer_cost._unit_cost  }}</span><span class="mc" >{{count }}</span><span>{{ your_product.prosumer_cost._value | number : 2}}</span></li>
				
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.transport_cost._value ? your_product.transport_cost._value : "&nbsp;"}}</span></li>
					    </ul>
					</li>
					<!-- heffingen -->
					<li class="parent parent-toggle parent-3">
						<p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.heffingen._value ? your_product.heffingen._value : "&nbsp;"}}</span></p>
					    <ul class="sub parent-3-sub">
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.contribution_cost._value ? your_product.contribution_cost._value : "&nbsp;"}}</span></li>
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.fed_cont_cost._value ? your_product.fed_cont_cost._value : "&nbsp;"}}</span></li>
					        <li ng-if="your_product.fund_cost" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.fund_cost._value}}</span></li>
							<li ng-if="your_product.turtle_tax" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.turtle_tax._value}}</span></li>
							<li ng-if="your_product.openbare_dienstverlening" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.openbare_dienstverlening._value}}</span></li>
					    </ul>
					</li>
					<!-- totaal -->
					<li class="parent parent-result parent-4">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.total_cost_no_discount._value*1 + (your_product.prosumer_cost? 0*count*your_product.prosumer_cost._unit_cost:0) | number : 2}}</span></p>
					</li>

					<!-- vreg 
					<li class="parent-section parent-result parent-8">
					    <a ng-if="your_product.VREG._value" class="button vreg-button" href="{{your_product.VREG._value}}" target="_blank">Bekijk berekening op VREG</a>
					</li> -->

					<!-- kortingen -->
					<li class="parent parent-toggle parent-5 discount">
				       	<p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.total_discount._value ? your_product.total_discount._value : "&nbsp;"}}</span></p>
					    <ul class="sub parent-5-sub">
                            <li ng-if="best_product.korting_in_EUR || your_product.korting_in_EUR" class="clearfix">
                            	<span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.korting_in_EUR._value ? your_product.korting_in_EUR._value : "&nbsp;"}}</span>
                            </li>
							<li ng-if="best_product.korting_in_ckWh || your_product.korting_in_ckWh" class="clearfix">
								<span class="mc">&nbsp;{{your_product.korting_in_ckWh._unit_cost}}</span><span class="mc">{{your_product.korting_in_ckWh._units ? your_product.korting_in_ckWh._units : "&nbsp;"}}</span>{{your_product.korting_in_ckWh._value ? your_product.korting_in_ckWh._value : "&nbsp;"}}</span>
							</li>
							<li ng-if="best_product.korting_in_prokWh || your_product.korting_in_prokWh" class="clearfix">
								<span class="mc">&nbsp;{{your_product.korting_in_prokWh._unit_cost ? your_product.korting_in_prokWh._unit_cost : "&nbsp;"}}%</span><span class="mc">{{your_product.korting_in_prokWh._units ? your_product.korting_in_prokWh._units : "&nbsp;"}}</span><span>{{your_product.korting_in_prokWh._value ? your_product.korting_in_prokWh._value : "&nbsp;"}}</span>
							</li>
							<li ng-if="best_product.korting_day_night || your_product.korting_day_night" class="clearfix">
								<span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.korting_day_night._value ? your_product.korting_day_night._value : "&nbsp;"}}</span>
							</li>
						    </ul>
					</li>
					<!-- totaal na discount -->
					<li class="parent parent-result parent-6">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{your_product.total_cost._value*1 + (your_product.prosumer_cost?0*count*your_product.prosumer_cost._unit_cost:0) | number : 2 }}</span></p>
					</li>
					<!-- uw besparing -->
					<li class="parent parent-result parent-7" ng-show="your_product">
					<p class="clearfix"><span class="mc save">{{your_product.total_cost._value - best_product.total_cost._value - (markup_green && best_product.markup_green ? best_product.markup_green._value*1:0) | number : 2}}</span><span class="mc">=</span><span >{{your_product.total_cost._value * 1 + (your_product.prosumer_cost?0*count*your_product.prosumer_cost._unit_cost:0) | number : 2 }}</span></p>
					</li>
				</ol>	
				<!-- tariefkaarten 
				<ol>				
					<li class="parent-section parent-result parent-9">
						<div><img class="left" src="assets/images/pdf-icon.png" alt="essent" /><a class="left">Open tariefkaart</a></div>
					</li>
				</ol>				
				-->	
			</div>
			<div class="optimal-contract left">
				<ol>
					<li class="title">Proposed product</li>
					<!-- providers -->
					<li class="provider clearfix">
						<img class="left" ng-src="/images/providers/{{best_product._provider}}-logo.png" alt="{{best_product._provider}}" />
						<b class="left">{{best_product._product}}</b>
					</li>
					<!-- legend -->
					<li class="legend clearfix"><span class="mc">c/kWh</span><span class="mc">kWh</span><span translate>Prijs</span></li>
					<!-- energiekost -->
					<li class="parent parent-toggle parent-1">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.total_energy._value ? best_product.total_energy._value*1 + (markup_green && best_product.markup_green ? best_product.markup_green._value*1:0): "&nbsp;"}}</span></p>
					    <ul class="sub parent-1-sub">
					        <li ng-if="best_product.abonnement" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.abonnement._value ? best_product.abonnement._value : "&nbsp;"}}</span></li>
					        <li ng-if="best_product.abonnement_meter" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.abonnement_meter._value ? best_product.abonnement_meter._value : "&nbsp;"}}</span></li>
						<li ng-if="best_product.variabel_gas" class="clearfix"><span class="mc">{{ best_product.variabel_gas._unit_cost  }}</span><span class="mc">{{ best_product.variabel_gas._units }}</span><span>{{ best_product.variabel_gas._value }}</span></li>
						<li ng-if="best_product.variabele_kost_dag" class="clearfix"><span class="mc">{{ best_product.variabele_kost_dag._unit_cost  }}</span><span class="mc">{{ best_product.variabele_kost_dag._units }}</span><span>{{ best_product.variabele_kost_dag._value }}</span></li>
						<li ng-if="best_product.variabele_kost_nacht" class="clearfix"><span class="mc">{{ best_product.variabele_kost_nacht._unit_cost  }}</span><span class="mc">{{ best_product.variabele_kost_nacht._units }}</span><span>{{ best_product.variabele_kost_nacht._value }}</span></li>
						<li ng-if="best_product.variabele_kost_excl_nacht" class="clearfix"><span class="mc">{{ best_product.variabele_kost_excl_nacht._unit_cost  }}</span><span class="mc">{{ best_product.variabele_kost_excl_nacht._units }}</span><span>{{ best_product.variabele_kost_excl_nacht._value }}</span></li>
						<li ng-if="markup_green && best_product.markup_green" class="clearfix"><span class="mc">{{ best_product.markup_green._unit_cost  }}</span><span class="mc">{{ best_product.markup_green._units }}</span><span>{{ best_product.markup_green._value }}</span></li>
						<li ng-if="best_product.cost_green" class="clearfix"><span class="mc">{{ best_product.cost_green._unit_cost  }}</span><span class="mc">{{ best_product.cost_green._units }}</span><span>{{ best_product.cost_green._value }}</span></li>
						<li ng-if="best_product.cost_wkk" class="clearfix"><span class="mc">{{ best_product.cost_wkk._unit_cost  }}</span><span class="mc">{{ best_product.cost_wkk._units }}</span><span>{{ best_product.cost_wkk._value }}</span></li>
					    </ul>
					</li>
					<!-- nettarieven -->
					<li class="parent parent-toggle parent-2">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.net_tariff._value*1 + (best_product.prosumer_cost?0*count*best_product.prosumer_cost._unit_cost:0) | number : 2}}</span></p>
					    <ul class="sub parent-2-sub">
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.distribution_cost._value ? best_product.distribution_cost._value : "&nbsp;"}}</span></li>
						<li ng-if="best_product.prosumer_cost" class="clearfix"><span class="mc">&nbsp;{{ best_product.prosumer_cost._unit_cost  }}</span><span><input disabled style="height:25px;margin:0;padding-top: 0px;text-align:right;padding-bottom: 0px;" ng-keyup="change()" type="number" placeholder="{{ best_product.prosumer_cost._units }}" ng-init="input.kVAField=best_product.prosumer_cost._units;change();" ng-model="input.kVAField"/></span><span>{{ best_product.prosumer_cost._value | number : 2}}</span></li>
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.transport_cost._value ? best_product.transport_cost._value : "&nbsp;"}}</span></li>
					    </ul>
					</li>
					<!-- heffingen -->
					<li class="parent parent-toggle parent-3">
						<p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.heffingen._value ? best_product.heffingen._value : "&nbsp;"}}</span></p>
					    <ul class="sub parent-3-sub">
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.contribution_cost._value ? best_product.contribution_cost._value : "&nbsp;"}}</span></li>
					        <li class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.fed_cont_cost._value ? best_product.fed_cont_cost._value : "&nbsp;"}}</span></li>
					        <li ng-if="best_product.fund_cost" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.fund_cost._value}}</span></li>
							<li ng-if="best_product.turtle_tax" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.turtle_tax._value}}</span></li>
							<li ng-if="best_product.openbare_dienstverlening" class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.openbare_dienstverlening._value}}</span></li>
					    </ul>
					</li>
					<!-- totaal -->
					<li class="parent parent-result parent-4">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{ best_product.total_cost_no_discount._value*1 + (best_product.prosumer_cost?0*count*best_product.prosumer_cost._unit_cost:0) + (markup_green && best_product.markup_green ? best_product.markup_green._value*1:0)| number : 2 }}</span></p>
					</li>
					<!-- vreg 
					<li class="parent-section parent-result parent-8">
					    <a ng-if="best_product.VREG._value" class="button vreg-button" href="{{best_product.VREG._value}}" target="_blank">Bekijk berekening op VREG</a>
					</li>-->
					<!-- kortingen -->
					<li class="parent parent-toggle parent-5 discount">
						<p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.total_discount._value ? best_product.total_discount._value : "&nbsp;"}}</span></p>
					    <ul class="sub parent-5-sub">
                            <li ng-if="best_product.korting_in_EUR || (your_product && your_product.korting_in_EUR)" class="clearfix">
                            	<span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.korting_in_EUR._value ? best_product.korting_in_EUR._value : "&nbsp;"}}</span>
                            </li>
							<li ng-if="best_product.korting_in_ckWh || (your_product && your_product.korting_in_ckWh)" class="clearfix">
								<span class="mc">&nbsp;{{best_product.korting_in_ckWh._unit_cost ? best_product.korting_in_ckWh._unit_cost : "&nbsp;"}}</span><span class="mc">{{best_product.korting_in_ckWh._units ? best_product.korting_in_ckWh._units : "&nbsp;"}}</span><span>{{best_product.korting_in_ckWh._value ? best_product.korting_in_ckWh._value : "&nbsp;"}}</span>
							</li>
							<li ng-if="best_product.korting_in_prokWh || (your_product && your_product.korting_in_prokWh)" class="clearfix">
								<span class="mc">&nbsp;{{best_product.korting_in_prokWh._unit_cost ? best_product.korting_in_prokWh._unit_cost : "&nbsp;"}}%</span><span class="mc">{{best_product.korting_in_prokWh._units ? best_product.korting_in_prokWh._units : "&nbsp;"}}</span><span>{{best_product.korting_in_prokWh._value ? best_product.korting_in_prokWh._value : "&nbsp;"}}</span>
							</li>
							<li ng-if="best_product.korting_day_night || (your_product && your_product.korting_day_night)" class="clearfix">
								<span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.korting_day_night._value ? best_product.korting_day_night._value : "&nbsp;"}}</span>
							</li>
					    </ul>
					</li>
					<!-- totaal na discount -->
					<li class="parent parent-result parent-6">
					    <p class="clearfix"><span class="mc">&nbsp;</span><span class="mc">&nbsp;</span><span>{{best_product.total_cost._value*1 + (best_product.prosumer_cost?0*count*best_product.prosumer_cost._unit_cost:0) + (markup_green && best_product.markup_green ? best_product.markup_green._value*1:0)| number : 2}}</span></p>
					</li>
					<!-- uw besparing -->
					<li class="parent parent-result parent-7" ng-if="your_product">
					<p class="clearfix"><span class="mc save">&nbsp;</span><span class="mc">-</span><span>{{best_product.total_cost._value * 1 + (best_product.prosumer_cost?0*count*best_product.prosumer_cost._unit_cost:0) + (markup_green && best_product.markup_green ? best_product.markup_green._value*1:0)| number : 2}}</span></p>
					</li>
				</ol>	
				<!-- tariefkaarten 
				<ol>				
					<li class="parent-section parent-result parent-9">
						<div><img class="left" src="assets/images/pdf-icon.png" alt="essent" /><a class="left">Open tariefkaart</a></div>
					</li>
				</ol>				
				-->	
			</div>
			<!-- Close modal -->
			<a class="close-reveal-modal" ng-click="cancel()"></a>
		</div>
	</div>
</div>
